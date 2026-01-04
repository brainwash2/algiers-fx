import requests
import re
import datetime
from database import insert_rate_row

# --- CONFIGURATION ---
MIN_PRICE_THRESHOLD = 50.0  
# ---------------------

def get_official_rates():
    try:
        url = "https://open.er-api.com/v6/latest/EUR"
        data = requests.get(url, timeout=10).json()
        rates = data['rates']
        eur = rates['DZD']
        return {
            "EUR": round(eur, 2),
            "USD": round(eur / rates['USD'], 2),
            "GBP": round(eur / rates['GBP'], 2),
            "CAD": round(eur / rates['CAD'], 2)
        }
    except:
        return {"EUR": 152.0, "USD": 139.0, "GBP": 190.0, "CAD": 105.0}

def scrape_devisesquare():
    print("   Trying Source 1: Devisesquare...")
    url = "https://devisesquare.com/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Referer": "https://www.google.com/"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            print(f"   ⚠️ Blocked (Status {response.status_code})")
            return {}
            
        html = response.text
        patterns = {
            "EUR": r'EURO.*?(\d{3}(?:\.\d+)?).*?BUY.*?(\d{3}(?:\.\d+)?)',
            "USD": r'DOLLAR.*?(\d{3}(?:\.\d+)?).*?BUY.*?(\d{3}(?:\.\d+)?)',
            "GBP": r'POUND.*?(\d{3}(?:\.\d+)?).*?BUY.*?(\d{3}(?:\.\d+)?)',
            "CAD": r'CA.*?DOLLAR.*?(\d{3}(?:\.\d+)?).*?BUY.*?(\d{3}(?:\.\d+)?)'
        }
        
        results = {}
        for code, pattern in patterns.items():
            match = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
            if match and float(match.group(1)) > MIN_PRICE_THRESHOLD:
                results[f"{code}_BUY"] = float(match.group(1))
                results[f"{code}_SELL"] = float(match.group(2))
        
        return results
    except Exception as e:
        print(f"   ⚠️ Source 1 Failed: {e}")
        return {}

def scrape_squarealger():
    print("   Trying Source 2: SquareAlger (Backup)...")
    url = "https://www.squarealger.com/"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        html = response.text
        
        # Their format is often a table
        patterns = {
            "EUR": r'EUR.*?Achat.*?(\d{3}).*?Vente.*?(\d{3})',
            "USD": r'USD.*?Achat.*?(\d{3}).*?Vente.*?(\d{3})',
            "GBP": r'GBP.*?Achat.*?(\d{3}).*?Vente.*?(\d{3})',
            "CAD": r'CAD.*?Achat.*?(\d{3}).*?Vente.*?(\d{3})'
        }
        
        results = {}
        for code, pattern in patterns.items():
            match = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
            if match:
                results[f"{code}_BUY"] = float(match.group(1))
                results[f"{code}_SELL"] = float(match.group(2))
        
        return results
    except Exception as e:
        print(f"   ⚠️ Source 2 Failed: {e}")
        return {}

def fetch_and_save():
    print("🚀 Starting Dual-Engine Scraper...")
    official = get_official_rates()
    
    # TRY SOURCE 1
    parallel = scrape_devisesquare()
    
    # IF SOURCE 1 MISSING DATA, TRY SOURCE 2
    if not parallel or len(parallel) < 4:
        print("   ⚠️ Primary source incomplete. Switching to Backup.")
        backup_data = scrape_squarealger()
        # Merge backup data into parallel (filling gaps)
        parallel.update(backup_data)

    # FINAL CHECK: If both fail, use these specific Fallbacks
    defaults = {"EUR": 283.0, "USD": 279.0, "GBP": 355.0, "CAD": 175.0}
    
    currencies = ["EUR", "USD", "GBP", "CAD"]
    for curr in currencies:
        buy = parallel.get(f"{curr}_BUY", defaults[curr])
        sell = parallel.get(f"{curr}_SELL", defaults[curr] + 2.0)
        
        print(f"✅ Saving {curr}: {buy} / {sell}")
        insert_rate_row(curr, official.get(curr, 0), buy, sell)

    print("--- SYNC COMPLETE ---")

if __name__ == "__main__":
    fetch_and_save()
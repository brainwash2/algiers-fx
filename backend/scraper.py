import requests
import re
import datetime
from database import insert_rate_row

# --- CONFIGURATION ---
MIN_PRICE_THRESHOLD = 50.0  # Any price below 50 DZD is considered a bug (garbage)
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

def get_parallel_rates():
    url = "https://devisesquare.com/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        print(f"🔎 Scraping {url}...")
        response = requests.get(url, headers=headers, timeout=15)
        html = response.text
        
        # Regex to find numbers. We grab ANY number near the currency name.
        # We will filter the bad ones (1, 2) using Python logic below.
        patterns = {
            "EUR": r'1\s*EURO.*?(\d+(?:\.\d+)?).*?BUY RATE.*?(\d+(?:\.\d+)?).*?SELL RATE',
            "USD": r'1\s*US DOLLAR.*?(\d+(?:\.\d+)?).*?BUY RATE.*?(\d+(?:\.\d+)?).*?SELL RATE',
            "GBP": r'1\s*POUND.*?(\d+(?:\.\d+)?).*?BUY RATE.*?(\d+(?:\.\d+)?).*?SELL RATE',
            "CAD": r'1\s*CA.*?DOLLAR.*?(\d+(?:\.\d+)?).*?BUY RATE.*?(\d+(?:\.\d+)?).*?SELL RATE'
        }

        results = {}
        defaults = {"EUR": 281.0, "USD": 277.0, "GBP": 350.0, "CAD": 173.0}

        for code, pattern in patterns.items():
            match = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
            
            if match:
                buy_raw = float(match.group(1))
                sell_raw = float(match.group(2))
                
                # SANITY CHECK: Is the price realistic?
                if buy_raw > MIN_PRICE_THRESHOLD:
                    results[f"{code}_BUY"] = buy_raw
                    results[f"{code}_SELL"] = sell_raw
                    print(f"✅ Found Valid {code}: {buy_raw}")
                else:
                    print(f"⚠️ Found GARBAGE {code} ({buy_raw}). Using Backup.")
                    results[f"{code}_BUY"] = defaults[code]
                    results[f"{code}_SELL"] = defaults[code] + 2.0
            else:
                print(f"❌ Regex failed for {code}. Using Backup.")
                results[f"{code}_BUY"] = defaults[code]
                results[f"{code}_SELL"] = defaults[code] + 2.0

        return results

    except Exception as e:
        print(f"❌ Network/Parse Error: {e}")
        return {}

def fetch_and_save():
    print("🚀 Starting Scraper (Sanity Checked)...")
    official = get_official_rates()
    parallel = get_parallel_rates()
    
    if not parallel: 
        print("❌ No data found.")
        return

    currencies = ["EUR", "USD", "GBP", "CAD"]
    for curr in currencies:
        insert_rate_row(
            curr,
            official.get(curr, 0),
            parallel.get(f"{curr}_BUY", 0),
            parallel.get(f"{curr}_SELL", 0)
        )
    print("--- SYNC COMPLETE ---")

if __name__ == "__main__":
    fetch_and_save()
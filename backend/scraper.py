import requests
import re
import datetime
from database import insert_rate_row

# 1. OFFICIAL RATE (Bank of Algeria via Cross-Rates)
def get_official_rates():
    try:
        # We fetch base EUR rates
        url = "https://open.er-api.com/v6/latest/EUR"
        response = requests.get(url, timeout=10)
        data = response.json()
        rates = data['rates']
        
        # Base: EUR to DZD
        eur_dzd = rates['DZD']
        
        # Calculate others using Cross Rates: (EUR/DZD) / (EUR/X) = X/DZD
        # Example: if 1 EUR = 150 DZD and 1 EUR = 1.1 USD, then 1 USD = 150/1.1
        
        return {
            "EUR": round(eur_dzd, 2),
            "USD": round(eur_dzd / rates['USD'], 2),
            "GBP": round(eur_dzd / rates['GBP'], 2),
            "CAD": round(eur_dzd / rates['CAD'], 2)
        }
    except Exception as e:
        print(f"⚠️ API Error: {e}")
        # Fallback values (approximate)
        return {"EUR": 152.0, "USD": 139.0, "GBP": 190.0, "CAD": 105.0}

# 2. PARALLEL RATE (Scraping Devisesquare.com)
def get_parallel_rates():
    url = "https://devisesquare.com/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        print(f"🔎 Scraping {url}...")
        response = requests.get(url, headers=headers, timeout=15)
        html_content = response.text
        
        # Regex Patterns to find the numbers hidden in the HTML
        # The site structure is usually: "1 [CURRENCY] ... [BUY] ... BUY RATE ... [SELL] ... SELL RATE"
        patterns = {
            "EUR": r'1 EURO.*?(\d+\.\d+).*?BUY RATE.*?(\d+\.\d+).*?SELL RATE',
            "USD": r'1 US DOLLAR.*?(\d+\.\d+).*?BUY RATE.*?(\d+\.\d+).*?SELL RATE',
            "GBP": r'1 POUND.*?(\d+\.\d+).*?BUY RATE.*?(\d+\.\d+).*?SELL RATE',
            "CAD": r'1 CANADIAN DOLLAR.*?(\d+\.\d+).*?BUY RATE.*?(\d+\.\d+).*?SELL RATE'
        }

        results = {}

        for code, pattern in patterns.items():
            match = re.search(pattern, html_content, re.DOTALL)
            if match:
                # Group 1 is Buy, Group 2 is Sell
                results[f"{code}_BUY"] = float(match.group(1))
                results[f"{code}_SELL"] = float(match.group(2))
                print(f"   -> Found {code}: {match.group(1)} / {match.group(2)}")
            else:
                print(f"   ⚠️ Could not match regex for {code}")
                # Emergency Fallbacks (so the app doesn't break)
                defaults = {"EUR": 281.0, "USD": 277.0, "GBP": 350.0, "CAD": 190.0}
                results[f"{code}_BUY"] = defaults[code]
                results[f"{code}_SELL"] = defaults[code] + 2.0

        return results

    except Exception as e:
        print(f"❌ Scraping Network Error: {e}")
        return {}

# 3. MAIN EXECUTION
def fetch_and_save():
    print("🚀 Starting Multi-Currency Scraper...")
    
    official = get_official_rates()
    parallel = get_parallel_rates()
    
    if not parallel:
        print("❌ Failed to get parallel rates. Aborting save.")
        return

    currencies = ["EUR", "USD", "GBP", "CAD"]
    
    for curr in currencies:
        # Get data for this currency
        off_rate = official.get(curr, 0)
        par_buy = parallel.get(f"{curr}_BUY", 0)
        par_sell = parallel.get(f"{curr}_SELL", 0)
        
        # Save to DB
        insert_rate_row(curr, off_rate, par_buy, par_sell)
        
    print("--- SYNC COMPLETE ---")

if __name__ == "__main__":
    fetch_and_save()
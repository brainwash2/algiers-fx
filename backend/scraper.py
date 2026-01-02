import requests
import re
import datetime
from database import insert_rate_row

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
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        html = response.text
        
        # UPDATED REGEX: More flexible
        # 1. Matches "EURO" OR "EU DOLLAR" etc.
        # 2. Matches numbers like "281" OR "281.00" (Optional decimal)
        patterns = {
            "EUR": r'1\s*EURO.*?(\d+(?:\.\d+)?).*?BUY RATE.*?(\d+(?:\.\d+)?).*?SELL RATE',
            "USD": r'1\s*US DOLLAR.*?(\d+(?:\.\d+)?).*?BUY RATE.*?(\d+(?:\.\d+)?).*?SELL RATE',
            "GBP": r'1\s*POUND.*?(\d+(?:\.\d+)?).*?BUY RATE.*?(\d+(?:\.\d+)?).*?SELL RATE',
            "CAD": r'1\s*CA.*?DOLLAR.*?(\d+(?:\.\d+)?).*?BUY RATE.*?(\d+(?:\.\d+)?).*?SELL RATE'
        }

        results = {}

        for code, pattern in patterns.items():
            match = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
            if match:
                results[f"{code}_BUY"] = float(match.group(1))
                results[f"{code}_SELL"] = float(match.group(2))
            else:
                print(f"⚠️ Could not find real rate for {code}. Using Backup.")
                # These are your backup numbers if scraping fails
                defaults = {"EUR": 281.0, "USD": 277.0, "GBP": 350.0, "CAD": 170.0}
                results[f"{code}_BUY"] = defaults[code]
                results[f"{code}_SELL"] = defaults[code] + 2.0

        return results

    except Exception as e:
        print(f"❌ Error: {e}")
        return {}

def fetch_and_save():
    print("🚀 Starting Scraper...")
    official = get_official_rates()
    parallel = get_parallel_rates()
    
    if not parallel: return

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
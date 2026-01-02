import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError("❌ Missing Supabase credentials. Check your .env file inside the backend folder.")

# Initialize Supabase
supabase: Client = create_client(url, key)

def insert_rate_row(currency_code: str, official: float, parallel_buy: float, parallel_sell: float):
    """
    Inserts a single currency record into Supabase.
    Example: insert_rate_row("EUR", 152.0, 281.0, 277.0)
    """
    record = {
        "currency_pair": f"{currency_code}_DZD",
        "official_buy": official,
        "official_sell": official, # Official rate usually has negligible spread for this context
        "parallel_buy": parallel_buy,
        "parallel_sell": parallel_sell,
        "source": "devisesquare_scraper_v2"
    }

    try:
        response = supabase.table("currency_rates").insert(record).execute()
        print(f"✅ Saved {currency_code} to Database.")
        return True
    except Exception as e:
        print(f"❌ Error saving {currency_code}: {e}")
        return False
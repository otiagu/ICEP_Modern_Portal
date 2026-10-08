from playwright.sync_api import sync_playwright
import time
import sys

def main():
    p = sync_playwright().start()
    
    # We want a persistent context or just a headed browser that stays open
    # We'll use headless=False so the user can interact
    browser = p.chromium.launch(headless=False, slow_mo=50)
    
    # Create a single context
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    
    base_url = "http://127.0.0.1:8080"
    
    # 1. Open Coordinator
    coord_page = context.new_page()
    coord_page.goto(f"{base_url}/ICEP_coordinator_modern.html")
    
    # 2. Open Course Rep
    cr_page = context.new_page()
    cr_page.goto(f"{base_url}/ICEP_courserep_modern.html")
    
    # 3. Open Student Profile
    st_page = context.new_page()
    st_page.goto(f"{base_url}/ICEP_student_profile_modern.html")
    
    print("Browser tabs opened successfully! Keep this script running to keep them open.")
    print("Press Ctrl+C to close.")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Closing browsers...")
    finally:
        browser.close()
        p.stop()

if __name__ == "__main__":
    main()

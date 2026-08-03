import math
import json

# Reference Point: 3255 S Dorsey Ln, Tempe, AZ 85282
REF_LAT = 33.3920
REF_LNG = -111.9163
ORIGIN_ADDRESS = "3255+S+Dorsey+Ln,+Tempe,+AZ+85282"

RESTAURANTS_RAW = [
    {
        "id": 1,
        "name": "Bombay House – Tempe",
        "cuisine": "Indian",
        "isBuffet": True,
        "priceLevel": 1,
        "priceDisplay": "~$15–$18 pp ($)",
        "lat": 33.3783,
        "lng": -111.9094,
        "address": "1801 E Baseline Rd #104, Tempe, AZ 85283",
        "rating": "4.6 ★",
        "dishes": "Butter chicken, Tandoori chicken drumsticks, Coconut fish curry, Garlic naan.",
        "menuUrl": "https://bombayhousetempe.com/",
        "googleMapUrl": "https://maps.google.com/?q=Bombay+House+Tempe"
    },
    {
        "id": 2,
        "name": "Yama Sushi House – Chandler",
        "cuisine": "Japanese",
        "isBuffet": True,
        "priceLevel": 2,
        "priceDisplay": "~$26–$29 pp ($$)",
        "lat": 33.3201,
        "lng": -111.8622,
        "address": "1175 W Ray Rd #1, Chandler, AZ 85224",
        "rating": "4.7 ★",
        "dishes": "Torch-seared nigiri, Salmon carpaccio, Chicken teriyaki, Tempura shrimp.",
        "menuUrl": "https://www.yamasushihousechandler.com/",
        "googleMapUrl": "https://maps.google.com/?q=Yama+Sushi+House+Chandler"
    },
    {
        "id": 3,
        "name": "Malee's Thai Bistro – Old Town",
        "cuisine": "Thai",
        "isBuffet": False,
        "priceLevel": 2,
        "priceDisplay": "~$20–$28 pp ($$)",
        "lat": 33.4932,
        "lng": -111.9287,
        "address": "7131 E Main St, Scottsdale, AZ 85251",
        "rating": "4.5 ★",
        "dishes": "Siamese fish, Green curry chicken, Tom yum seafood soup, Giant shrimp pad thai.",
        "menuUrl": "https://www.maleesonmain.com/",
        "googleMapUrl": "https://maps.google.com/?q=Malees+Thai+Bistro+Scottsdale"
    },
    {
        "id": 4,
        "name": "SumoMaya – Scottsdale",
        "cuisine": "Mexican",
        "isBuffet": False,
        "priceLevel": 3,
        "priceDisplay": "~$35–$50 pp ($$$)",
        "lat": 33.5338,
        "lng": -111.9261,
        "address": "6560 E Scottsdale Rd, Scottsdale, AZ 85253",
        "rating": "4.6 ★",
        "dishes": "Hamachi ceviche, Coconut shrimp, Wood-fired chicken, Asian-Mexican fusion.",
        "menuUrl": "https://sumomaya.com/",
        "googleMapUrl": "https://maps.google.com/?q=SumoMaya+Scottsdale"
    },
    {
        "id": 5,
        "name": "Bombay House – Scottsdale",
        "cuisine": "Indian",
        "isBuffet": True,
        "priceLevel": 1,
        "priceDisplay": "~$15–$18 pp ($)",
        "lat": 33.5552,
        "lng": -111.9095,
        "address": "8140 N Hayden Rd, Scottsdale, AZ 85258",
        "rating": "4.6 ★",
        "dishes": "Butter chicken, Tandoori drumsticks, Shrimp curry, Fresh naan.",
        "menuUrl": "https://bombayhousetempe.com/",
        "googleMapUrl": "https://maps.google.com/?q=Bombay+House+Scottsdale"
    },
    {
        "id": 6,
        "name": "Tandoori Times – Scottsdale",
        "cuisine": "Indian",
        "isBuffet": True,
        "priceLevel": 2,
        "priceDisplay": "~$18–$24 pp ($$)",
        "lat": 33.5552,
        "lng": -111.9095,
        "address": "8140 N Hayden Rd, Scottsdale, AZ 85258",
        "rating": "4.4 ★",
        "dishes": "Tandoori chicken, Chicken tikka masala, Shrimp curry, Garlic naan.",
        "menuUrl": "https://www.toasttab.com/local/tandoori-times-indian-bistro",
        "googleMapUrl": "https://maps.google.com/?q=Tandoori+Times+Scottsdale"
    },
    {
        "id": 7,
        "name": "Yama Sushi House – Central Phoenix",
        "cuisine": "Japanese",
        "isBuffet": True,
        "priceLevel": 2,
        "priceDisplay": "~$26–$29 pp ($$)",
        "lat": 33.5065,
        "lng": -112.0738,
        "address": "4750 N Central Ave #150, Phoenix, AZ 85012",
        "rating": "4.7 ★",
        "dishes": "Fresh nigiri, Salmon carpaccio, Chicken teriyaki bento, Tempura shrimp.",
        "menuUrl": "https://www.yamasushiphoenix.com/",
        "googleMapUrl": "https://maps.google.com/?q=Yama+Sushi+House+Central+Phoenix"
    },
    {
        "id": 8,
        "name": "Yama Sushi House – Scottsdale",
        "cuisine": "Japanese",
        "isBuffet": True,
        "priceLevel": 2,
        "priceDisplay": "~$26–$29 pp ($$)",
        "lat": 33.5675,
        "lng": -111.9168,
        "address": "7704 E Doubletree Ranch Rd, Scottsdale, AZ 85258",
        "rating": "4.7 ★",
        "dishes": "Specialty sushi rolls, Chicken gyoza, Teriyaki salmon, Tempura.",
        "menuUrl": "https://www.yamascottsdale.com/",
        "googleMapUrl": "https://maps.google.com/?q=Yama+Sushi+House+Scottsdale"
    },
    {
        "id": 9,
        "name": "The Mexicano – Phoenix/PV",
        "cuisine": "Mexican",
        "isBuffet": False,
        "priceLevel": 2,
        "priceDisplay": "~$22–$30 pp ($$)",
        "lat": 33.5990,
        "lng": -111.9790,
        "address": "4801 E Cactus Rd, Phoenix, AZ 85032",
        "rating": "4.6 ★",
        "dishes": "Slow-braised achiote chicken, Grilled snapper tacos, Tableside guacamole.",
        "menuUrl": "https://www.themexicano.com/",
        "googleMapUrl": "https://maps.google.com/?q=The+Mexicano+Phoenix"
    },
    {
        "id": 10,
        "name": "Kasai Japanese Steakhouse – Scottsdale",
        "cuisine": "Japanese",
        "isBuffet": False,
        "priceLevel": 3,
        "priceDisplay": "~$45–$60 pp ($$$)",
        "lat": 33.6169,
        "lng": -111.9261,
        "address": "14344 N Scottsdale Rd, Scottsdale, AZ 85254",
        "rating": "4.8 ★",
        "dishes": "Chilean sea bass, Garlic butter tiger shrimp, Teppan chicken.",
        "menuUrl": "https://kasaiteppan.com/",
        "googleMapUrl": "https://maps.google.com/?q=Kasai+Japanese+Steakhouse+Scottsdale"
    },
    {
        "id": 11,
        "name": "Yama Sushi House – Union Hills",
        "cuisine": "Japanese",
        "isBuffet": True,
        "priceLevel": 2,
        "priceDisplay": "~$26–$29 pp ($$)",
        "lat": 33.6552,
        "lng": -112.0641,
        "address": "718 E Union Hills Dr, Phoenix, AZ 85024",
        "rating": "4.7 ★",
        "dishes": "Fresh nigiri, Spicy salmon rolls, Chicken fried rice, Tempura.",
        "menuUrl": "https://www.yamaunionhills.com/",
        "googleMapUrl": "https://maps.google.com/?q=Yama+Sushi+House+Union+Hills"
    },
    {
        "id": 12,
        "name": "Tandoori Times 2 – Glendale",
        "cuisine": "Indian",
        "isBuffet": True,
        "priceLevel": 2,
        "priceDisplay": "~$18–$24 pp ($$)",
        "lat": 33.6393,
        "lng": -112.1802,
        "address": "5626 W Bell Rd, Glendale, AZ 85308",
        "rating": "4.4 ★",
        "dishes": "Chicken 65, Chili prawns, Tandoori chicken, Fresh garlic naan.",
        "menuUrl": "https://www.google.com/search?q=Tandoori+Times+Glendale+menu",
        "googleMapUrl": "https://maps.google.com/?q=Tandoori+Times+Glendale"
    },
    {
        "id": 13,
        "name": "Kasai Japanese Steakhouse – Peoria",
        "cuisine": "Japanese",
        "isBuffet": False,
        "priceLevel": 3,
        "priceDisplay": "~$45–$60 pp ($$$)",
        "lat": 33.5528,
        "lng": -112.2705,
        "address": "9824 W Northern Ave, Peoria, AZ 85345",
        "rating": "4.8 ★",
        "dishes": "Teppan shrimp, Chilean sea bass, Coconut curry chicken.",
        "menuUrl": "https://kasaiteppan.com/",
        "googleMapUrl": "https://maps.google.com/?q=Kasai+Japanese+Steakhouse+Peoria"
    },
    {
        "id": 14,
        "name": "Yama Sushi House – Peoria",
        cuisine: "Japanese",
        "isBuffet": True,
        "priceLevel": 2,
        "priceDisplay": "~$26–$29 pp ($$)",
        "lat": 33.5528,
        "lng": -112.2705,
        "address": "9788 W Northern Ave #1450, Peoria, AZ 85345",
        "rating": "4.7 ★",
        "dishes": "Sushi combinations, Chicken teriyaki, Tempura shrimp.",
        "menuUrl": "https://yamasushihouse.com/",
        "googleMapUrl": "https://maps.google.com/?q=Yama+Sushi+House+Peoria"
    }
]

def compute_haversine(lat1, lon1, lat2, lon2):
    R = 3958.8  # Earth radius in miles
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    straight_dist = R * c
    est_drive_dist = straight_dist * 1.25  # Grid adjustment factor
    est_time_mins = int(est_drive_dist * 1.35)
    return round(est_drive_dist, 1), f"~{est_time_mins} mins"

def main():
    processed = []
    for loc in RESTAURANTS_RAW:
        dist, time_str = compute_haversine(REF_LAT, REF_LNG, loc["lat"], loc["lng"])
        loc["distMiles"] = dist
        loc["driveTime"] = time_str
        encoded_addr = loc["address"].replace(" ", "+")
        loc["navUrl"] = f"https://www.google.com/maps/dir/?api=1&origin={ORIGIN_ADDRESS}&destination={encoded_addr}"
        processed.append(loc)

    with open('../data/restaurants.json', 'w') as f:
        json.dump(processed, f, indent=2)

    print("Successfully built data/restaurants.json!")

if __name__ == "__main__":
    main()

const { MongoClient } = require('mongodb');

//URI за локално инсталирана база данни MongoDB
const localMongoDBURI = 'mongodb://0.0.0.0:27017/online-shop'; 

//URI за MongoDB инсталиран в контейнер на Docker
const dockerContainerURI = 'mongodb://local-mongo:27017/online-shop'; 

const date = new Date();
const accountsData = [
    {
        account:
        {
            username: 'Example Admin',
            email: 'admin@example.com',
            hashedPassword: '$2b$10$1HlT5WNceXMFJ902KdD71exWNLi.fhDap3ESKVlZnjhJf4fOCnsRq',
            role: 'administrator'
        }
    },

    {
        account:
        {
            username: 'Example Manager',
            email: 'manager@example.com',
            hashedPassword: '$2b$10$1HlT5WNceXMFJ902KdD71exWNLi.fhDap3ESKVlZnjhJf4fOCnsRq',
            role: 'manager'
        }
    },
    {
        account: {
            username: 'Example Customer',
            email: 'customer@manager.com',
            hashedPassword: '$2b$10$1HlT5WNceXMFJ902KdD71exWNLi.fhDap3ESKVlZnjhJf4fOCnsRq',
            role: 'customer'
        }
    }
];

const itemsData = [
    {
        "item": {
            "title": "Teddy Bear",
            "quantity": 20,
            "price": 25,
            "description": "Sample Description",
            "condition": "Unpacked",
            "category": "Toys"
        }
    },
    {
        "item": {
            "title": "Car Toy",
            "quantity": 20,
            "price": 5,
            "description": "Small car toy",
            "condition": "Brand new",
            "category": "Toys"
        }
    },
    {
        "item": {
            "title": "Flexon FR1225CN Light Duty Garden Hose, 25ft, Green",
            "quantity": 15,
            "price": 30,
            "imageURL": "https://m.media-amazon.com/images/I/6131g63dYKS._AC_SX679_.jpg",
            "description": "\nBrand\t  Flexon\nMaterial\tVinyl\nColor\tGreen\nProduct Dimensions\t300\"L x 0.62\"W\nItem Weight\t2.5 Pounds\nAbout this item\nRadial reinforcement with a tough, weather-resistant vinyl cover\nExcellent handling, even in cold weather\nEasy connect couplings\nBest used for everyday gardening and lawn care. Lightweight\nQuality assurance 3-year",
            "condition": "Brand new",
            "category": "Home and Garden"
        }
    },
    {
        "item": {
            "title": "Corona BP 3180D Forged Classic Bypass Pruner with 1 Inch Cutting Capacity, 1\", Red",
            "quantity": 15,
            "price": 30,
            "imageURL": "https://m.media-amazon.com/images/I/51V+OcaWSvL._AC_SX679_.jpg",
            "description": "Brand\tCorona\nColor\tRed\nItem Weight\t13.6 Ounces\nStyle\tBypass Pruner\nProduct Dimensions\t8.5\"L x 1\"W\nAbout this item\nMAXFORGEDTM STEEL: Corona's forging process compacts steel molecules into our strongest, most durable tools that stay sharper longer\nDUAL ARC BYPASS BLADE efficiently cuts green or dry branches and stems\nHAND-MATCHED HOOK AND BLADE: Slant-ground, narrow-profile hook and blade are matched by hand to ensure precise, close cuts\nSELF-CLEANING SAP GROOVE removes debris for smooth, efficient cutting action\nRESHARPENABLE BLADE for long-lasting performance and reliability\nCOMFORTABLE, NON-SLIP GRIP best suited for medium- to large-sized hands\nCORONA CARES about creating eco-friendly products by implementing 100% recyclable packaging, planting over 15,000 trees to date, and by providing tools to organizations that help grow food and plant urban trees",
            "condition": "Brand new",
            "category": "Home and Garden"
        }
    },
    {
        "item": {
            "title": "Harry Potter and the Order of the Phoenix: The Illustrated Edition (Harry Potter, Book 5)",
            "quantity": 5,
            "price": 20,
            "imageURL": "https://images-us.bookshop.org/ingram/9780545791434.jpg?height=500&v=v2-64db2dd638bec67593206bdbb41994e8",
            "description": "The fifth book in the beloved, bestselling Harry Potter series, now illustrated in brilliant full color.",
            "condition": "Brand new",
            "category": "Books"
        }
    },
    {
        "item": {
            "title": "To Kill a Mockingbird",
            "quantity": 5,
            "price": 25,
            "imageURL": "https://images-us.bookshop.org/ingram/9780060935467.jpg?height=500&v=v2",
            "description": "Voted America's Best-Loved Novel in PBS's The Great American Read\n\nHarper Lee's Pulitzer Prize-winning masterwork of honor and injustice in the deep South--and the heroism of one man in the face of blind and violent hatred\n\nOne of the most cherished stories of all time, To Kill a Mockingbird has been translated into more than forty languages, sold more than forty million copies worldwide, served as the basis for an enormously popular motion picture, and was voted one of the best novels of the twentieth century by librarians across the country. A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice, it views a world of great beauty and savage inequities through the eyes of a young girl, as her father--a crusading local lawyer--risks everything to defend a black man unjustly accused of a terrible crime.",
            "condition": "Brand new",
            "category": "Books"
        }
    },
    {
        "item": {
            "title": "Garnier Fructis Pure Clean Purifying Shampoo, Silicone-Free, 12.5 Fl Oz, 3 Count",
            "quantity": 15,
            "price": 13,
            "imageURL": "https://m.media-amazon.com/images/I/81syi-4Vr4L._SX679_.jpg",
            "description": "Remove up to 100% of residue with our lightweight shampoo and purify your hair for beautiful, softer strands at every wash\nInfused with aloe extract plus Vitamins B3 & B6, our shampoo and conditioner system cleanses and hydrates for clean, healthy hair with no weigh-down and gentle for everyday use for all hair types\nGarnier is committed to Greener Beauty - our bottles excluding pumps and caps are made of 100% Recycled Plastic\nParaben Free, Silicone-Free\nLeaping Bunny certified, Cruelty Free and Vegan",
            "condition": "Brand new",
            "category": "Health and Beauty"
        }
    },
    {
        "item": {
            "title": "NIVEA White Peach and Jasmine Body Wash with Nourishing Serum, Pack of 3, 20 Fl Oz",
            "quantity": 15,
            "price": 13,
            "imageURL": "https://m.media-amazon.com/images/I/41-JuTph2CS._SX300_SY300_QL70_FMwebp_.jpg",
            "description": "Revitalizing Scent: White peach and jasmine scented body wash fills your shower with a refreshing and revitalizing scent\nGently Cleanses: This NIVEA body wash with Nourishing Serum is enriched with a unique blend of plant-derived oils, essential skin lipids and vitamins that work together to gently cleanse your skin\nLong Lasting Moisture: NIVEA White Peach and Jasmine Body Wash leaves skin feeling soft and smooth all day\nUse for Shaving: The creamy lather of this body wash is also a great alternative to shaving soap or shaving cream\nIncludes three (3) 20 fluid ounce bottle of NIVEA White Peach and Jasmine Body Wash with Nourishing Serum",
            "condition": "Brand new",
            "category": "Health and Beauty"
        }
    },
    {
        "item": {
            "title": "Gaiam Yoga Mat - Premium 6mm Print Extra Thick Non Slip Exercise & Fitness Mat for All Types of Yoga",
            "quantity": 5,
            "price": 30,
            "imageURL": "https://m.media-amazon.com/images/I/914MwYd2yFL._AC_SX679_.jpg",
            "description": "LIGHTWEIGHT & THICK YOGA MAT: These durable, yet lightweight exercise yoga mats are extra thick for the additional cushioning your joints need during any yoga or fitness routine\nSTICKY NON SLIP TEXTURE: Yoga mat features a textured sticky non slip surface for excellent traction and superior grip and a stylish design to keep you motivated and focused\nNON TOXIC & 6P FREE PVC yoga mat is a healthier choice for you and the planet and free of DEHP, DBP, BBP, DINP, DIDP and DNOP\nFREE YOGA CLASS: Yoga mat purchase includes a free bonus downloadable yoga workout to help get you started\nDIMENSIONS: 68 inches L x 24 inches W x 6 millimeters thick",
            "condition": "Brand new",
            "category": "Sports and Outdoors"
        }
    },
    {
        "item": {
            "title": "Coleman Sundome Camping Tent, 2/3/4/6 Person Dome Tent with Easy Setup in Under 10 Mins",
            "quantity": 3,
            "price": 70,
            "imageURL": "https://m.media-amazon.com/images/I/71AIHD5lPvL._AC_SX679_.jpg",
            "description": "Weatherproof: Welded corners and inverted seams keep water from getting in; Included rainfly offers extra weather protection\nWind and rain tested: Strong frame withstands 35 plus mph winds\nGreat ventilation: Large windows and ground vent for enhanced airflow\nStay connected: E-port makes it easy to bring electrical power inside\nEasy setup: In 10 minutes\nRoomy interior: 9 x 7 feet with 4 feet 11 inch center height; Fits 1 queen-size air bed\n1-year limited warranty",
            "condition": "Brand new",
            "category": "Sports and Outdoors"
        }
    },
    {
        "item": {
            "title": "Meguiar's G7014J Gold Class Carnauba Plus Premium Paste Wax",
            "quantity": 10,
            "price": 15,
            "imageURL": "https://m.media-amazon.com/images/I/81dxNtyCOKL._AC_SX466_.jpg",
            "description": "PASTE WAX FOR HIGH SHINE: Luxurious blend of carnauba wax and polymers creates strong, long-lasting protection to preserve your finish with a brilliant reflective shine\nCLEAR COAT SAFE: Special blend of carnauba and protecting polymers is safe and effective on clear coats and all glossy paint types\nBETTER GLOW: Improved formula creates an even more brilliant shine and deeper reflections\nREADY TO USE: Comes with high-quality soft foam applicator\nEASY, VERSATILE USE: Easily glides on and off, and can be applied by hand or Dual Action Polisher like Meguiar's MT300",
            "condition": "Brand new",
            "category": "Automotive"
        }
    },
    {
        "item": {
            "title": "LIQUI MOLY Top Tec 4600 SAE 5W-30 | 5 L | Synthesis technology motor oil | SKU: 20448",
            "quantity": 10,
            "price": 65,
            "imageURL": "https://m.media-amazon.com/images/I/61XzL2b7-bL._AC_SX466_.jpg",
            "description": "Excellent wear protection\nHigh lubrication reliability\nEspecially suitable for vehicles with diesel particulate filter\nFor extended service intervals\nReduces fuel compensation and pollutant emissions\nCompatible for the use with turbochargers and catalytic converters\nMixable with most engine oils",
            "condition": "Brand new",
            "category": "Automotive"
        }
    },
    {
        "item": {
            "title": "SAMSUNG 32-Inch Class QLED 4K Q60C Series Quantum HDR, Dual LED",
            "category": "Electronics",
            "quantity": 2,
            "price": 150,
            "imageURL": "https://m.media-amazon.com/images/I/71bmtncxa+L._AC_SX466_.jpg",
            "description": "100% COLOR VOLUME W/ QUANTUM DOT: Take in a billion shades of unwavering color and enjoy vivid, lifelike color at any brightness level as Quantum Dot technology works to create every shade you see on screen*.Voltage : 120 volts (AC)\nQUANTUM PROCESSOR LITE W/ 4K UPSCALING: See shows and movies in a whole new light with 4K optimization; Enjoy enhanced clarity and depth in every scene as our Quantum Processor Lite with 4K Upscaling automatically transforms everything you watch\nDUAL LED: Don’t call it temperamental; You’ll enjoy beautifully balanced colors with dedicated warm and cool Dual LED backlights; Get stronger and accurate contrast with innovative technology that adapts automatically to match your content\nQUANTUM HDR: Watch the details shine through with Quantum HDR that goes beyond leading standards to create deep blacks, impressive contrast, and picture quality that’s analyzed and refined to match the creator’s vison\nMOTION XCELERATOR: Experience smooth motion and improved clarity with Motion Xcelerator; Now you can fuel your need for speed with high intensity sports, movies, and games, and enjoy crisp and clear details at the same time\nOBJECT TRACKING SOUND LITE: You’ll hear 3D surround sound that follows the movement on screen using our incredible virtual top channel audio—putting you right in the middle of the car chase, stampede or party scene\nQ-SYMPHONY 3.0: With Q-Symphony, your TV speakers paired with Q-Series and S-Series soundbar operate as one; Together, they can optimize all the channels to bring you a masterfully orchestrated sound experience**",
            "condition": "Damaged"
        }
    },
    {
        "item": {
            "title": "SAMSUNG 32-inch Class LED Smart FHD TV 720P (UN32M4500BFXZA)",
            "category": "Electronics",
            "quantity": 3,
            "price": 200,
            "imageURL": "https://m.media-amazon.com/images/I/91+tRvBTNkL._AC_SX466_.jpg",
            "description": "About this item\nHD 720p: Enjoy a viewing experience with 2x the clarity and detail\nSmart TV: Access your favorite program choices, live TV, video on demand, apps and social media in one easy-to-browse navigation experience.\nQuad-Core Processor: Enjoy a Fluid browsing experience and faster control- switching between apps, streaming content and other media effortlessly.\nScreen Mirroring: The screen mirroring feature allows you to mirror your phone or other compatible mobile device’s screen onto the TV’s screen wirelessly\nVariety of Connections: 2 HDMI ports, 1 USB port, 802.11AC built-in Wi-Fi, 1 Component In, 1 Composite In (Shared with AV Component Input), and 1 Digital Optical Output\nDIMENSIONS (INCHES W x H x D): TV WITHOUT STAND: 28.9 x 17.3 x 3.1 | TV WITH STAND: 28.9 x 18.2 x 6.4",
            "condition": "Brand new"
        }
    },
    {
        "item": {
            "title": "Outward Hound Fun Feeder Slo Bowl, Slow Feeder Dog Bowl, Medium/Mini, Turquoise",
            "category": "Pet Supplies",
            "quantity": 10,
            "price": 9,
            "imageURL": "https://m.media-amazon.com/images/I/81WahUfd37L._AC_SX679_.jpg",
            "description": "About this item\nSLOWS DOWN EATING UP TO 10X: Outward Hound uniquely designed Fun Feeder dog bowls feature meal-lengthening ridges to help slow down your dog’s eating time by 10X!\nAIDS IN PROPER DIGESTION: Common issues that arise in fast-eating dogs include bloating, regurgitation, and canine obesity. Our Fun Feeder Slo Bowls both challenge and engage your dog during mealtime while helping reduce overeating behavior.",
            "condition": "Unpacked"
        }
    },
    {
        "item": {
            "title": "Orthopedic Sofa Dog Bed - Ultra Comfortable Dog Beds for Medium Dogs",
            "category": "Pet Supplies",
            "quantity": 4,
            "price": 50,
            "imageURL": "https://m.media-amazon.com/images/I/81OPxO1+oCL._AC_SX679_.jpg",
            "description": "ORTHOPEDIC DOG BED: Crafted of firm eggcrate foam, this dog bed evenly distributes your dog’s weight and soothes all its joints and pressure points. The elevated cushion provides back and neck support for your doggy’s comfort.\nCOZY COMFORT: The plush pet bed has a soft velvet exterior with a cushioned flannel top that’ll have your dog sink into oblivion. The nonslip bottom ensures the bed’s stability, granting your pet a secure sensation.",
            "condition": "Brand new"
        }
    },
    {
        "item": {
            "title": "Fuwidvia 3 Pack Airplane Launcher Toys, 13.2'' LED Foam Glider Catapult Plane Toy for Boys",
            "category": "Toys",
            "quantity": 2,
            "price": 25,
            "imageURL": "https://m.media-amazon.com/images/I/71Vex+UqD4L._AC_SX679_.jpg",
            "description": "3 Pack Airplane Toys - Our glider boy toy is equipped with 3 different colors of green, orange, and blue gliding foam planes, and 1 plane launcher. Throwing planes by hand or flying them with launcher, kids can cultivate their hand-eye coordination, observation, and sense of direction.\nHow to Use - 1. Insert the wing. 2. Choose the flight mode (Gyrant Mode & Gliding Mode) according to the position of the rear wing of the foam airplane, and insert the tail 3. Place these flying toys at the firing launcher position 4. Push and pull the load, pull the trigger, and the glider plane takes off.",
            "condition": "Brand new"
        }
    },
    {
        "item": {
            "title": "Car Jack Kit Scissor Jack for Car 2 Ton (4409 lbs) Tire Jack Tool Kit Universal Car Emergency Ki",
            "category": "Automotive",
            "condition": "Brand new",
            "quantity": 2,
            "price": 50,
            "imageURL": "https://m.media-amazon.com/images/I/71oQGvEdOQL._AC_SX466_.jpg",
            "description": "【Car Jack Capacity】Maximum lifting weight 2 Ton (4409 lbs),This Jack for Car Lifting Range from 4.33\" (11cm) to 15.75\"(40cm). The scissor lift jack provides a wider range to reach under low chassis sedans or elevate high-body SUVs effortlessly.\n【Complete Tire Replacement Kit】1x 2T Scissor jack; 1x Ratchet Wrench; 1x Lug Wrench(17/19mm 21/23mm); 1x Gloves; 1x Pencil Tire Pressure Gauge; 1x Storage Bag.he all-inclusive kit fits perfectly in your trunk or garage, ready to tackle any emergency tire replacement job."
        }
    }
]

const ordersData = [
    {
        "order": {
            "email": "admin@admin.com",
            "shoppingCart": [
                {
                    "itemCount": 1,
                    "itemTitle": "Corona BP 3180D Forged Classic Bypass Pruner with 1 Inch Cutting Capacity, 1\", Red",
                    "price": 30
                },
                {
                    "itemCount": 2,
                    "itemTitle": "Garnier Fructis Pure Clean Purifying Shampoo, Silicone-Free, 12.5 Fl Oz, 3 Count",
                    "price": 26
                },
                {
                    "itemCount": 2,
                    "itemTitle": "Fuwidvia 3 Pack Airplane Launcher Toys, 13.2'' LED Foam Glider Catapult Plane Toy for Boys",
                    "price": 50
                },
                {
                    "itemCount": 1,
                    "itemTitle": "Harry Potter and the Order of the Phoenix: The Illustrated Edition (Harry Potter, Book 5)",
                    "price": 20
                },
                {
                    "itemCount": 3,
                    "itemTitle": "Car Toy",
                    "price": 15
                },
                {
                    "itemCount": 2,
                    "itemTitle": "Teddy Bear",
                    "price": 50
                }
            ],
            "finalPrice": 191,
            "date": date
        }
    },
    {
        "order": {
            "email": "admin@admin.com",
            "shoppingCart": [
                {
                    "itemCount": 4,
                    "itemTitle": "Fuwidvia 3 Pack Airplane Launcher Toys, 13.2'' LED Foam Glider Catapult Plane Toy for Boys",
                    "price": 100
                },
                {
                    "itemCount": 1,
                    "itemTitle": "Harry Potter and the Order of the Phoenix: The Illustrated Edition (Harry Potter, Book 5)",
                    "price": 20
                },
                {
                    "itemCount": 1,
                    "itemTitle": "SAMSUNG 32-inch Class LED Smart FHD TV 720P (UN32M4500BFXZA)",
                    "price": 200
                },
                {
                    "itemCount": 1,
                    "itemTitle": "Corona BP 3180D Forged Classic Bypass Pruner with 1 Inch Cutting Capacity, 1\", Red",
                    "price": 30
                }
            ],
            "finalPrice": 350,
            "date": date
        }
    },
    {
        "order": {
            "email": "admin@admin.com",
            "shoppingCart": [
                {
                    "itemCount": 2,
                    "itemTitle": "Meguiar's G7014J Gold Class Carnauba Plus Premium Paste Wax",
                    "price": 30
                },
                {
                    "itemCount": 1,
                    "itemTitle": "LIQUI MOLY Top Tec 4600 SAE 5W-30 | 5 L | Synthesis technology motor oil | SKU: 20448",
                    "price": 65
                },
                {
                    "itemCount": 1,
                    "itemTitle": "Car Jack Kit Scissor Jack for Car 2 Ton (4409 lbs) Tire Jack Tool Kit Universal Car Emergency Ki",
                    "price": 50
                }
            ],
            "finalPrice": 145,
            "date": date
        }
    },
    {
        "order": {
            "email": "admin@admin.com",
            "shoppingCart": [
                {
                    "itemCount": 1,
                    "itemTitle": "To Kill a Mockingbird",
                    "price": 25
                },
                {
                    "itemCount": 1,
                    "itemTitle": "Harry Potter and the Order of the Phoenix: The Illustrated Edition (Harry Potter, Book 5)",
                    "price": 20
                }
            ],
            "finalPrice": 45,
            "date": date
        }
    },
    {
        "order": {
            "email": "admin@admin.com",
            "shoppingCart": [
                {
                    "itemCount": 1,
                    "itemTitle": "Gaiam Yoga Mat - Premium 6mm Print Extra Thick Non Slip Exercise & Fitness Mat for All Types of Yoga",
                    "price": 30
                }
            ],
            "finalPrice": 30,
            "date": date
        }
    }
]

const shoppingCartsData = [
    {
        "account": "admin@example.com",
        "shoppingCart": [
            {
                "title": "To Kill a Mockingbird",
                "count": 1
            },
            {
                "title": "SAMSUNG 32-Inch Class QLED 4K Q60C Series Quantum HDR, Dual LED",
                "count": 1
            },
            {
                "title": "Flexon FR1225CN Light Duty Garden Hose, 25ft, Green",
                "count": 1
            }
        ]
    }
]
async function insertDocuments() {
    const client = new MongoClient(localMongoDBURI);

    try {
        await client.connect();

        const database = client.db('online-shop');

        const accountsCollection = database.collection('accounts');
        await accountsCollection.insertMany(accountsData);

        const itemsCollection = database.collection('items');
        await itemsCollection.insertMany(itemsData);

        const ordersCollection = database.collection('orders');
        await ordersCollection.insertMany(ordersData);

        const shoppingCartCollection = database.collection('shoppingCarts');
        await shoppingCartCollection.insertMany(shoppingCartsData);

        console.log('Documents inserted successfully!');
    } catch (error) {
        console.error('Error inserting documents:', error);
    } finally {
        await client.close();
    }
}

insertDocuments();
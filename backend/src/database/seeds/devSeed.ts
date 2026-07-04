import bcrypt from "bcrypt"

const PASSWORD = "123456"

export type DevSeed = Awaited<ReturnType<typeof createDevSeedData>>

export async function createDevSeedData() {
    const passwordHash = await bcrypt.hash(PASSWORD, 10)

    return {
        password: PASSWORD,

        store: {
            name: "Manasiness Demo Store",
            email: "demo@manasiness.dev",
            passwordHash,
            phone: "+51999999999",
            currencyCode: "PEN",
            currencySymbol: "S/",
            image: "https://i.postimg.cc/DzKtGYCx/nouserphoto.png"
        },

        categories: [
            {
                key: "drinks",
                name: "Drinks",
                image: "https://i.postimg.cc/KYydTs9w/noimage.png"
            },
            {
                key: "snacks",
                name: "Snacks",
                image: "https://i.postimg.cc/KYydTs9w/noimage.png"
            }
        ],

        users: [
            {
                key: "customer",
                name: "Demo Customer",
                image: "https://i.postimg.cc/DzKtGYCx/nouserphoto.png",
                phone: "+51911111111",
                role: "customer"
            },
            {
                key: "supplier",
                name: "Demo Supplier",
                image: "https://i.postimg.cc/DzKtGYCx/nouserphoto.png",
                phone: "+51922222222",
                role: "supplier"
            },
            {
                key: "worker",
                name: "Demo Worker",
                image: "https://i.postimg.cc/DzKtGYCx/nouserphoto.png",
                phone: "+51933333333",
                role: "worker"
            }
        ],

        products: [
            {
                key: "water",
                categoryKey: "drinks",
                name: "Water Bottle",
                image: "https://i.postimg.cc/KYydTs9w/noimage.png",
                costPrice: 1.00,
                salePrice: 2.50,
                stock: 25
            },
            {
                key: "chips",
                categoryKey: "snacks",
                name: "Potato Chips",
                image: "https://i.postimg.cc/KYydTs9w/noimage.png",
                costPrice: 2.00,
                salePrice: 4.50,
                stock: 18
            }
        ],

        sales: [
            {
                productKey: "water",
                userKey: "customer",
                quantity: 2,
                state: "paid"
            },
            {
                productKey: "chips",
                userKey: "customer",
                quantity: 1,
                state: "pending"
            }
        ],

        orders: [
            {
                productKey: "water",
                userKey: "supplier",
                quantity: 10,
                state: "paid"
            },
            {
                productKey: "chips",
                userKey: "supplier",
                quantity: 5,
                state: "pending"
            }
        ],

        staff: [
            {
                userKey: "worker",
                salary: 40,
                state: "paid"
            },
            {
                userKey: "worker",
                salary: 25,
                state: "pending"
            }
        ]
    } as const
}
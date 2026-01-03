const mongoose = require('mongoose');
const Tour = require('./models/Tour');
require('dotenv').config();

const realTours = [
    {
        title: 'Antalya - Oila va Hordiq (Ultra All Inclusive)',
        fromCity: 'Tashkent',
        toCity: 'Antalya',
        duration: '7 kun',
        startDate: new Date('2024-06-20'),
        priceAdult: 1150,
        priceChild: 850,
        capacity: 40,
        description: 'Antalyaning Belek tumanidagi 5 yulduzli premium mehmonxonada unutilmas hordiq. Narx ichiga: aviachipta, transfer, sug\'urta va "UAI" tizimidagi ovqatlanish kiritilgan.',
        isPopular: true,
        isGreatPackage: true,
        discountType: 'percentage',
        discountValue: 15,
        status: 'Active',
        images: ['/assets/img/package-1.jpg']
    },
    {
        title: 'Istanbul - Ikki Qit\'a Chorrahasi',
        fromCity: 'Tashkent',
        toCity: 'Istanbul',
        duration: '5 kun',
        startDate: new Date('2024-05-10'),
        priceAdult: 820,
        priceChild: 650,
        capacity: 25,
        description: 'Sultonahmet maydoni, Ayo Sofiya va Moviy masjid bo\'ylab sayohat. Bosfor bo\'g\'ozida kema safari va mazali turk oshxonasi.',
        isPopular: true,
        isGreatPackage: false,
        discountType: 'none',
        discountValue: 0,
        status: 'Active',
        images: ['/assets/img/destination-1.jpg']
    },
    {
        title: 'Dubai - Kelajak Shahri va Shopping',
        fromCity: 'Tashkent',
        toCity: 'Dubai',
        duration: '6 kun',
        startDate: new Date('2024-05-25'),
        priceAdult: 980,
        priceChild: 750,
        capacity: 30,
        description: 'Burj Xalifa, Dubai Mall va musiqiy favvoralar. Cho\'l safari (Desert Safari) va Jumeirah plyajlarida dam olish.',
        isPopular: true,
        isGreatPackage: true,
        discountType: 'fixed',
        discountValue: 60,
        status: 'Active',
        images: ['/assets/img/package-2.jpg']
    },
    {
        title: 'Sharm El Sheikh - Qizil Dengiz Mo\'jizasi',
        fromCity: 'Tashkent',
        toCity: 'Sharm El Sheikh',
        duration: '8 kun',
        startDate: new Date('2024-10-05'),
        priceAdult: 750,
        priceChild: 550,
        capacity: 35,
        description: 'Dunyoning eng go\'zal marjon riflarida sho\'ng\'ish (diving) imkoniyati. Quyoshli Misr sohili va tarixiy Piramidalarga ekskursiya.',
        isPopular: false,
        isGreatPackage: true,
        discountType: 'percentage',
        discountValue: 10,
        status: 'Active',
        images: ['/assets/img/package-3.jpg']
    },
    {
        title: 'Bali - Ekzotik Orol va Tropik Tabiat',
        fromCity: 'Tashkent',
        toCity: 'Bali',
        duration: '12 kun',
        startDate: new Date('2024-09-12'),
        priceAdult: 1450,
        priceChild: 1100,
        capacity: 20,
        description: 'Gidravlik sharsharalar, guruch dalalari va toza okean havosi. Ubudning osoyishtaligi va Seminyakning shiddatli hayoti.',
        isPopular: true,
        isGreatPackage: false,
        discountType: 'none',
        discountValue: 0,
        status: 'Active',
        images: ['/assets/img/destination-4.jpg']
    },
    {
        title: 'Kuala Lumpur va Langkawi - Osiyo Ruhi',
        fromCity: 'Tashkent',
        toCity: 'Kuala Lumpur',
        duration: '10 kun',
        startDate: new Date('2024-11-20'),
        priceAdult: 1250,
        priceChild: 900,
        capacity: 25,
        description: 'Petronas egizak minoralari va Langkawining shaffof suvlari. Malayziyaning rang-barang madaniyati bilan tanishuv.',
        isPopular: false,
        isGreatPackage: true,
        discountType: 'percentage',
        discountValue: 20,
        status: 'Active',
        images: ['/assets/img/destination-2.jpg']
    },
    {
        title: 'Samarqand - Moviy Gumbazlar Ostida',
        fromCity: 'Tashkent',
        toCity: 'Samarqand',
        duration: '3 kun',
        startDate: new Date('2024-04-15'),
        priceAdult: 180,
        priceChild: 120,
        capacity: 50,
        description: 'Registon ansambli, Go\'ri-Amir va Shoxi-Zinda. O\'zbekistonning boy tarixini biz bilan kashf eting.',
        isPopular: true,
        isGreatPackage: true,
        discountType: 'fixed',
        discountValue: 20,
        status: 'Active',
        images: ['/assets/img/destination-3.jpg']
    },
    {
        title: 'Praga - Chexiya Bo\'ylab Sehrli Sayohat',
        fromCity: 'Tashkent',
        toCity: 'Praga',
        duration: '7 kun',
        startDate: new Date('2024-12-15'),
        priceAdult: 1600,
        priceChild: 1200,
        capacity: 15,
        description: 'Reyx ko\'prigi, astronomik soat va qadimiy qal\'alar. Evropaning eng go\'zal shaharlaridan birida unutilmas qishki ta\'til.',
        isPopular: false,
        isGreatPackage: false,
        discountType: 'none',
        discountValue: 0,
        status: 'Active',
        images: ['/assets/img/package-1.jpg']
    },
    {
        title: 'Boku - Kavkazning Zamonaviy Poytaxti',
        fromCity: 'Tashkent',
        toCity: 'Boku',
        duration: '5 kun',
        startDate: new Date('2024-05-02'),
        priceAdult: 680,
        priceChild: 500,
        capacity: 30,
        description: 'Olovli minoralar, Icheri-Sheher va Kaspiy dengizi bo\'yidagi sayr. Ozarbayjon poytaxtiga kross-madaniy sayohat.',
        isPopular: true,
        isGreatPackage: false,
        discountType: 'percentage',
        discountValue: 5,
        status: 'Active',
        images: ['/assets/img/package-2.jpg']
    },
    {
        title: 'Phuket - Tailandning Oltin Sohili',
        fromCity: 'Tashkent',
        toCity: 'Phuket',
        duration: '10 kun',
        startDate: new Date('2024-08-25'),
        priceAdult: 1180,
        priceChild: 850,
        capacity: 35,
        description: 'Patong plyaji, orollar bo\'ylab ekskursiya va ekzotik meyvalar. Tailandning quyoshli tabiatidan bahra oling.',
        isPopular: false,
        isGreatPackage: true,
        discountType: 'none',
        discountValue: 0,
        status: 'Active',
        images: ['/assets/img/package-3.jpg']
    }
];

async function populateTours() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/avocado-tour');
        console.log('Connected to MongoDB');

        // Clean slate before adding real data
        await Tour.deleteMany({});
        console.log('Cleared database for fresh data entry.');

        await Tour.insertMany(realTours);
        console.log('Successfully populated 10 real-world tour packages!');

        process.exit(0);
    } catch (error) {
        console.error('Error populating tours:', error);
        process.exit(1);
    }
}

populateTours();

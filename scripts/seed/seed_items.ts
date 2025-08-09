import { createClient } from '@supabase/supabase-js';
import 'dotenv/config'; // To load .env.local variables

// Sample data for seeding
const sampleData = [
    // === NFT Data ===
    {
        title: 'CryptoPunk #7804',
        description: 'A rare CryptoPunk, one of only nine Aliens. Features a cap forward, small shades, and a pipe.',
        image_url: 'https://i.seadn.io/gae/pyp5K-2_dKOKp_ADG2fS-1ss_obp_m3Vd_5r_h2d_shlS-z00-4hQ2UeE_bom2J2M5BLjuhd-Wz0A0sT2_6D29l4WA?auto=format&dpr=1&w=1000',
        price: 4200.00,
        mode: 'NFT',
        tags: ['Alien', 'Rare', 'Punks']
    },
    {
        title: 'Bored Ape #8817',
        description: 'A Bored Ape with a spinner hat, silver hoop earring, and a bored mouth. The fur is solid gold.',
        image_url: 'https://i.seadn.io/gae/5F2j2Fqg_O53r22iLz7i-y_b1aA3W_d_t_AFi-V8uS2x98_L_6_Sg-3E_l_pQ_m-v4h3tQ?auto=format&dpr=1&w=1000',
        price: 81.00,
        mode: 'NFT',
        tags: ['BAYC', 'Gold Fur', 'Ape']
    },

    // === Shopping Data ===
    {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling headphones with a new design. Crystal clear hands-free calling, with 4 microphones and advanced audio signal processing.',
        image_url: 'https://m.media-amazon.com/images/I/61vJtANMpvL._AC_SL1500_.jpg',
        price: 398.00,
        mode: 'Shopping',
        tags: ['Electronics', 'Audio', 'Headphones']
    },
    {
        title: 'Herman Miller Aeron Chair',
        description: 'The Aeron Chair is the benchmark for ergonomic seating since its debut in 1994. The chair’s innovative design and support for a range of postures, activities, and body types have made it an icon.',
        image_url: 'https://m.media-amazon.com/images/I/71p2S5W6F-L._AC_SL1500_.jpg',
        price: 1800.00,
        mode: 'Shopping',
        tags: ['Furniture', 'Office', 'Ergonomics']
    },

    // === Media Data ===
    {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
        image_url: 'https://m.media-amazon.com/images/M/MV5BN2Q5YTRiNDEtOWM0My00YTBlLWE5YzYtMTNjM2YxMWRjZjExXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1000_.jpg',
        price: 19.99,
        mode: 'Media',
        tags: ['Sci-Fi', 'Adventure', 'Film']
    },
     {
        title: 'The Three-Body Problem (Remembrance of Earth\'s Past)',
        description: 'A science fiction trilogy by Chinese writer Liu Cixin. The series portrays a future where Earth is bracing for an alien invasion from the Alpha Centauri system.',
        image_url: 'https://m.media-amazon.com/images/I/A15wD2SAa3L._SL1500_.jpg',
        price: 29.99,
        mode: 'Media',
        tags: ['Sci-Fi', 'Book Series', 'First Contact']
    },
];

async function seed() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Supabase URL or Service Role Key is not defined in .env.local");
    }

    // Use the service_role key for admin-level access for seeding
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting to seed database...");

    for (const item of sampleData) {
        console.log(`Inserting item: "${item.title}"...`);

        // 1. Insert the item data into the 'items' table
        const { data: insertedData, error: insertError } = await supabaseAdmin
            .from('items')
            .insert(item)
            .select()
            .single();

        if (insertError) {
            console.error(`Error inserting "${item.title}":`, insertError.message);
            // Check if it's a duplicate and continue if so
            if (insertError.code === '23505') { // unique_violation
                 console.log(`Item "${item.title}" already exists. Skipping.`);
                 continue;
            } else {
                // For other errors, stop the script
                return;
            }
        }

        if (!insertedData) {
            console.error(`Insertion failed for "${item.title}", no data returned.`);
            continue;
        }

        // 2. Trigger the 'embed-item' Edge Function to generate the embedding
        // This is done via a database trigger in a real production setup, but
        // invoking it manually here ensures it's done for the seed script.
        // NOTE: For this to work, you must have a DB trigger that calls the function.
        // A simpler alternative is to call the function directly as shown below.
        
        console.log(`Invoking embedding function for item ID: ${insertedData.id}`);
        const { error: functionError } = await supabaseAdmin.functions.invoke('embed-item', {
            body: { record: insertedData },
        });

        if (functionError) {
            console.error(`Error embedding "${item.title}":`, functionError.message);
        } else {
            console.log(`Successfully processed and embedded "${item.title}".`);
        }
        
        // Add a small delay to avoid rate-limiting on the OpenAI API
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log("\nDatabase seeding completed successfully!");
}

seed().catch(error => {
    console.error("\nAn error occurred during seeding:");
    console.error(error);
    process.exit(1);
});
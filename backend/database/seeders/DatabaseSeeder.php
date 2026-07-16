<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Inventory;
use App\Models\ProductImage;
use App\Models\ProductAttribute;
use App\Models\AttributeValue;
use App\Models\Coupon;
use App\Models\PageSection;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Shipment;
use App\Models\Review;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Roles & Permissions
        $manageProducts = Permission::create(['name' => 'manage-products']);
        $manageOrders = Permission::create(['name' => 'manage-orders']);
        $viewReports = Permission::create(['name' => 'view-reports']);

        $adminRole = Role::create(['name' => 'admin']);
        $vendorRole = Role::create(['name' => 'vendor']);
        $customerRole = Role::create(['name' => 'customer']);

        $adminRole->givePermissionTo([$manageProducts, $manageOrders, $viewReports]);
        $vendorRole->givePermissionTo($manageProducts);

        // 2. Seed Users
        $admin = User::create([
            'name' => 'Studio Admin',
            'email' => 'admin@kino.design',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole($adminRole);

        $vendor = User::create([
            'name' => 'Tuscan Carver',
            'email' => 'vendor@kino.design',
            'password' => bcrypt('password'),
        ]);
        $vendor->assignRole($vendorRole);

        $customer = User::create([
            'name' => 'Julian Sterling',
            'email' => 'julian@sterling.com',
            'password' => bcrypt('password'),
        ]);
        $customer->assignRole($customerRole);

        // 3. Seed Coupons
        Coupon::create([
            'code' => 'GOLDEN',
            'type' => 'percentage',
            'value' => 10.00,
            'min_spend' => 0.00,
            'starts_at' => now(),
            'expires_at' => now()->addDays(30),
        ]);

        Coupon::create([
            'code' => 'WELCOME15',
            'type' => 'percentage',
            'value' => 15.00,
            'min_spend' => 50.00,
            'starts_at' => now(),
            'expires_at' => now()->addDays(90),
        ]);

        // 4. Seed Attributes (Size, Color)
        $sizeAttr = ProductAttribute::create(['name' => 'Size']);
        $colorAttr = ProductAttribute::create(['name' => 'Color']);

        $szSmall = AttributeValue::create(['attribute_id' => $sizeAttr->id, 'value' => 'Small']);
        $szMed = AttributeValue::create(['attribute_id' => $sizeAttr->id, 'value' => 'Medium']);
        $szLarge = AttributeValue::create(['attribute_id' => $sizeAttr->id, 'value' => 'Grande']);

        $colCream = AttributeValue::create(['attribute_id' => $colorAttr->id, 'value' => 'Cream White', 'meta' => '#F5F0EA']);
        $colGold = AttributeValue::create(['attribute_id' => $colorAttr->id, 'value' => 'Gold Sand', 'meta' => '#E8B86D']);
        $colCharcoal = AttributeValue::create(['attribute_id' => $colorAttr->id, 'value' => 'Charcoal', 'meta' => '#1E1E1E']);

        // 5. Seed Categories
        $accCat = Category::create([
            'name' => 'Sculptural Accents',
            'slug' => 'accessories',
            'description' => 'Organic travertine trays, vases, and bowls.',
            'image' => 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80'
        ]);

        $livingCat = Category::create([
            'name' => 'Living Sanctuary',
            'slug' => 'living-room',
            'description' => 'Solid European oak lounge chairs, sideboards, and benches.',
            'image' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
        ]);

        $lightCat = Category::create([
            'name' => 'Silent Lighting',
            'slug' => 'lighting',
            'description' => 'Wheel-thrown ceramic lamps and fluted shades.',
            'image' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
        ]);

        // 6. Seed Products
        // Travertine Vessel
        $vessel = Product::create([
            'category_id' => $accCat->id,
            'name' => 'Travertine Sculpture Vessel',
            'tagline' => 'Hand-carved travertine catch-all',
            'description' => 'Formed by geothermal thermal springs over centuries, this travertine vessel displays unique voids and granular structures. Carved out of single-source quarry blocks in Tuscany workshops.',
            'price' => 180.00,
            'badge' => 'Exclusive',
            'status' => 'published'
        ]);

        ProductImage::create(['product_id' => $vessel->id, 'url' => 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1]);

        $vSmall = ProductVariant::create([
            'product_id' => $vessel->id,
            'sku' => 'TRAV-VESSEL-SM',
            'price_modifier' => 0.00,
            'attribute_values_json' => [$szSmall->id]
        ]);
        Inventory::create(['variant_id' => $vSmall->id, 'stock' => 12]);

        $vMed = ProductVariant::create([
            'product_id' => $vessel->id,
            'sku' => 'TRAV-VESSEL-MD',
            'price_modifier' => 45.00,
            'attribute_values_json' => [$szMed->id]
        ]);
        Inventory::create(['variant_id' => $vMed->id, 'stock' => 5]);

        // Oak Lounge Chair
        $chair = Product::create([
            'category_id' => $livingCat->id,
            'name' => 'Atelier Oak Lounge Chair',
            'tagline' => 'Solid oak fireside chair',
            'description' => 'Crafted out of Danish white oak timber logs. Uses classic tapered mortise-and-tenon joinery methods to ensure durability. Hand-burnished with non-toxic oils.',
            'price' => 750.00,
            'badge' => 'Bestseller',
            'status' => 'published'
        ]);

        ProductImage::create(['product_id' => $chair->id, 'url' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', 'sort_order' => 1]);

        $cCream = ProductVariant::create([
            'product_id' => $chair->id,
            'sku' => 'OAK-CHAIR-CRM',
            'price_modifier' => 0.00,
            'attribute_values_json' => [$colCream->id]
        ]);
        Inventory::create(['variant_id' => $cCream->id, 'stock' => 4]);

        $cCharcoal = ProductVariant::create([
            'product_id' => $chair->id,
            'sku' => 'OAK-CHAIR-CHR',
            'price_modifier' => 50.00,
            'attribute_values_json' => [$colCharcoal->id]
        ]);
        Inventory::create(['variant_id' => $cCharcoal->id, 'stock' => 2]);

        // 7. Seed Homepage Content Sections
        PageSection::create([
            'section_key' => 'home_hero',
            'title' => 'Sculptural Silent Form',
            'subtitle' => 'Kino Atelier — Collection 04',
            'description' => 'Elevating architectural spaces with curated interior pieces, handcrafted from single-source raw travertine, white oak, and fluted earthenware.',
            'cta_text' => 'Shop Now',
            'cta_link' => '/shop',
            'image_url' => 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1600&q=80',
            'meta_data' => [
                'explore_text' => 'Explore Collection',
                'explore_link' => '/about',
                'active_spaces_count' => 'Over 12,847 happy spaces curated globally'
            ]
        ]);

        PageSection::create([
            'section_key' => 'brand_story',
            'title' => 'An Atelier built on quiet, organic textures',
            'subtitle' => 'Our Heritage',
            'description' => "Kino Atelier emerged from a simple desire: to remove the noise from modern spaces. We design sculptural interior objects that speak through natural wood grains, raw travertine holes, and speckled clay shapes.\n\nWe collaborate with third-generation family workshops in Tuscany and Copenhagen to produce limited-run collections. We do not mass-produce; we build heirloom elements intended to survive generations.",
            'cta_text' => 'Discover Our Process',
            'cta_link' => '/about',
            'image_url' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
            'meta_data' => [
                'floating_title' => 'Sustainable Sourcing',
                'floating_description' => 'Every piece is carved from certified raw oak logs and stone blocks harvested under strict eco-preservation guidelines in Italy and Denmark.'
            ]
        ]);

        PageSection::create([
            'section_key' => 'promo_banner',
            'title' => '10% Off Private Collection',
            'subtitle' => 'Limited Seasonal Release',
            'description' => 'Enter private access code GOLDEN at checkout. Receive a complimentary hand-carved soapstone dish with orders exceeding $150.',
            'cta_text' => 'Shop Private Sale',
            'cta_link' => '/shop',
            'image_url' => 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
            'meta_data' => [
                'countdown_hours' => 14,
                'countdown_minutes' => 42,
                'countdown_seconds' => 19,
                'coupon_code' => 'GOLDEN'
            ]
        ]);

        PageSection::create([
            'section_key' => 'contact_info',
            'title' => 'Showrooms & Studios',
            'description' => 'Our designs can be viewed by appointment at our physical showrooms in Copenhagen or Tuscany. For bespoke dimensions or custom residential consulting, please reach our directors.',
            'meta_data' => [
                'address_title' => 'Copenhagen Atelier',
                'address_line1' => 'Nørrebrogade 14, 2200',
                'address_line2' => 'København, Denmark',
                'email_title' => 'Client Services Email',
                'email' => 'atelier@kino.design',
                'phone_title' => 'Studio Telephone',
                'phone' => '+45 32 88 19 00',
                'business_hours' => 'MON-FRI / 9:00 - 17:00 CET'
            ]
        ]);

        PageSection::create([
            'section_key' => 'instagram_feed',
            'title' => '#KinoAtelier',
            'subtitle' => 'Share Your Form',
            'meta_data' => [
                'instagram_link' => 'https://instagram.com/',
                'image_1' => 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=400&h=400&q=80',
                'image_2' => 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&h=400&q=80',
                'image_3' => 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&h=400&q=80',
                'image_4' => 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=400&h=400&q=80',
                'image_5' => 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&h=400&q=80'
            ]
        ]);

        // 8. Seed FAQs
        \App\Models\FAQ::create([
            'category' => 'Ordering & Customizations',
            'question' => 'Do you offer custom sizing configurations for your oak or stone tables?',
            'answer' => 'Yes. Every timber piece can be customized to length and width constraints. Please submit your request details via our Contact form or email the studio at consultation@kino.design for custom quote logs.',
            'sort_order' => 1
        ]);

        \App\Models\FAQ::create([
            'category' => 'Ordering & Customizations',
            'question' => 'Can I cancel or modify my order after authorization?',
            'answer' => 'Because our workshop teams begin select stone carving and oak joinery processing immediately upon order validation, modifications are permitted only within 24 hours of placement.',
            'sort_order' => 2
        ]);

        \App\Models\FAQ::create([
            'category' => 'Materials & Sourcing',
            'question' => 'Why are there natural holes and grooves in my Travertine pieces?',
            'answer' => 'Italian Travertine is formed in geothermal springs. The characteristic voids, holes, and texture pores are completely organic and represent natural history. We leave these holes un-filled to honor the honest structure of the stone.',
            'sort_order' => 3
        ]);

        \App\Models\FAQ::create([
            'category' => 'Materials & Sourcing',
            'question' => 'Where do you source your solid oak wood logs?',
            'answer' => 'Our solid white oak logs are harvested from FSC-certified sustainable forests in Denmark and northern Germany, tracking a strict tree-planting replacement ratio.',
            'sort_order' => 4
        ]);

        \App\Models\FAQ::create([
            'category' => 'Shipping & Delivery assisting',
            'question' => 'How long will it take for my order to be dispatched?',
            'answer' => 'Bespoke items (Lounge Chair, Writing Desk) take between 2 to 3 weeks for hand finishing. Home accessories (Travertine Vessel, Lighting) are dispatched from Copenhagen warehouses in 2-4 business days.',
            'sort_order' => 5
        ]);

        \App\Models\FAQ::create([
            'category' => 'Shipping & Delivery assisting',
            'question' => 'Do you offer global shipping and customs clearance?',
            'answer' => 'We ship worldwide. International shipping rates are calculated at checkout. Customs, duties, and import fees are handled by our shipping carriers during import clearance, ensuring standard delivery to your door.',
            'sort_order' => 6
        ]);

        \App\Models\FAQ::create([
            'category' => 'Returns & Warranties',
            'question' => 'What is your returns policy?',
            'answer' => 'We accept returns on all standard collections within 30 days of arrival. Items must be returned in their original wooden crates or secure boxes. Custom/bespoke sizing orders are final sale.',
            'sort_order' => 7
        ]);

        \App\Models\FAQ::create([
            'category' => 'Returns & Warranties',
            'question' => 'Is there a warranty on furniture joinery?',
            'answer' => 'All Kino Atelier furniture pieces carry a 10-year warranty against structural failures or wood joint breaks under regular residential conditions.',
            'sort_order' => 8
        ]);

        // 9. Seed Lookbook Blog Posts
        \App\Models\Post::create([
            'title' => 'The Wabi-Sabi Sanctuary: Styling Raw Travertine',
            'slug' => 'wabi-sabi-sanctuary',
            'excerpt' => 'Exploring the natural voids, visual depth, and raw weight of Italian volcanic stone within modern, glass-paneled architectural configurations.',
            'body' => "When we select materials, we prioritize silence. Visual weight doesn’t require complex shapes; it requires honest, raw structures that stand unburdened in the center of modern living rooms.\n\nTravertine stone and raw white oak timber are characterized by textures that cannot be engineered. The pits and organic irregularities in volcanic stones, or the dark concentric rings representing centuries of slow tree growth inside oak fibers, cannot be replicated.\n\nWhen styling these items, visual directors suggest grouping contrasting surfaces together. Position a highly textured, hand-carved travertine vessel directly adjacent to a clean, smooth steel table or alongside soft linen drapery. The immediate contrast heightens the physical warmth of the room, creating an atmospheric focal point.\n\nWe strive to retain raw material integrity by applying only thin coatings of natural oils and organic mineral glazes. This allows the stone and timber to age naturally, developing a subtle patina unique to the air, moisture, and daily operations of your residential sanctuary.",
            'read_time' => '4 min read',
            'image_url' => 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
            'published_at' => now()->subDays(2)
        ]);

        \App\Models\Post::create([
            'title' => 'Sustainable Oak Joinery: From Tree to Atelier',
            'slug' => 'sustainable-oak-joinery',
            'excerpt' => 'Trace the lineage of our FSC-certified white oak furniture pieces, hand-machined and finished in Danish family workshops.',
            'body' => "Our white oak wood logs are harvested from sustainable FSC-certified forestry logs. Classic mortise-and-tenon woodworking joinery provides physical strength that survives centuries.\n\nHandcrafted with non-toxic finishings, we minimize carbon tracks during shipping. Discover the wood grains and textures that make each piece unique.",
            'read_time' => '6 min read',
            'image_url' => 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80',
            'published_at' => now()->subDays(5)
        ]);

        \App\Models\Post::create([
            'title' => 'The Art of Ambient Lighting: Fluted Terracotta Drops',
            'slug' => 'art-of-ambient-lighting',
            'excerpt' => 'How directional downward light alters the textures of raw surfaces. A guide to designing evening sanctuaries using wheel-thrown pendants.',
            'body' => "Directional downward glows create warm, peaceful room atmospheres. Our fluted terracotta shades are wheel-thrown by local potters using natural clay minerals, then glazed to a beautiful matte eggshell finish.\n\nIdeal for kitchens, bedside readings, or library desks.",
            'read_time' => '3 min read',
            'image_url' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
            'published_at' => now()->subDays(10)
        ]);

        // 10. Seed Demo Orders for Julian Sterling
        $order1 = Order::create([
            'order_number' => 'ORD-2026-10395',
            'user_id' => $customer->id,
            'status' => 'confirmed',
            'email' => 'julian@sterling.com',
            'subtotal' => 180.00,
            'discount' => 0.00,
            'shipping_cost' => 25.00,
            'tax' => 14.40,
            'total' => 219.40,
            'payment_method' => 'card',
            'payment_status' => 'paid',
            'stripe_payment_intent_id' => 'pi_mock_111222333444555'
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $vessel->id,
            'variant_id' => $vSmall->id,
            'quantity' => 1,
            'price' => 180.00,
            'selected_options' => [['name' => 'Size', 'value' => 'Small']]
        ]);

        OrderStatusHistory::create([
            'order_id' => $order1->id,
            'status' => 'pending',
            'changed_by' => 'Julian Sterling',
            'notes' => 'Checkout Payment Intent initialized.'
        ]);

        OrderStatusHistory::create([
            'order_id' => $order1->id,
            'status' => 'confirmed',
            'changed_by' => 'System',
            'notes' => 'Payment authorized. Order confirmed.'
        ]);

        OrderStatusHistory::create([
            'order_id' => $order1->id,
            'status' => 'dispatched',
            'changed_by' => 'Studio Admin',
            'notes' => 'Package transferred to global carrier DHL Express.'
        ]);

        Shipment::create([
            'order_id' => $order1->id,
            'carrier' => 'DHL Express',
            'tracking_number' => 'DHL-992039281',
            'status' => 'transit',
            'shipped_at' => now()->subDay()
        ]);

        UserAddress::create([
            'user_id' => $customer->id,
            'type' => 'shipping',
            'first_name' => 'Julian',
            'last_name' => 'Sterling',
            'address_line1' => '42 Atelier Street',
            'city' => 'Copenhagen',
            'zip' => '10001',
            'country' => 'Denmark'
        ]);

        // Order 2
        $order2 = Order::create([
            'order_number' => 'ORD-2026-10482',
            'user_id' => $customer->id,
            'status' => 'pending',
            'email' => 'julian@sterling.com',
            'subtotal' => 750.00,
            'discount' => 75.00,
            'shipping_cost' => 0.00,
            'tax' => 54.00,
            'total' => 729.00,
            'payment_method' => 'card',
            'payment_status' => 'pending',
            'stripe_payment_intent_id' => 'pi_mock_999888777666555'
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => $chair->id,
            'variant_id' => $cCream->id,
            'quantity' => 1,
            'price' => 750.00,
            'selected_options' => [['name' => 'Color', 'value' => 'Cream White', 'meta' => '#F5F0EA']]
        ]);

        OrderStatusHistory::create([
            'order_id' => $order2->id,
            'status' => 'pending',
            'changed_by' => 'Julian Sterling',
            'notes' => 'Checkout checkout details submitted.'
        ]);

        // 11. Seed Verified Product Reviews
        Review::create([
            'user_id' => $customer->id,
            'product_id' => $vessel->id,
            'rating' => 5,
            'body' => 'The travertine Catch-All has an extraordinary visual weight. Its organic pits and natural volcanic bubbles represent genuine geological history. I have it sitting on my steel desk and the tactile contrast is phenomenal.',
            'is_verified_purchase' => true,
            'status' => 'approved'
        ]);

        Review::create([
            'user_id' => $customer->id,
            'product_id' => $chair->id,
            'rating' => 5,
            'body' => 'Flawless joinery details on the European Oak frame. It feels robust yet floats elegantly in our study space. Hand-burnished oil smells amazing.',
            'is_verified_purchase' => true,
            'status' => 'approved'
        ]);

        // Add a few more global product reviews from other dummy users for visual variety!
        $collector2 = User::create([
            'name' => 'Adrian Sterling',
            'email' => 'adrian@sterling.com',
            'password' => bcrypt('password'),
        ]);
        $collector2->assignRole($customerRole);

        Review::create([
            'user_id' => $collector2->id,
            'product_id' => $chair->id,
            'rating' => 4,
            'body' => 'Nordic Oak Lounge Chair drawers are smooth and felt-lined. Joinery details are flawless. Completely changes my office mood.',
            'is_verified_purchase' => true,
            'status' => 'approved'
        ]);

        $collector3 = User::create([
            'name' => 'Valerie Sterling',
            'email' => 'valerie@sterling.com',
            'password' => bcrypt('password'),
        ]);
        $collector3->assignRole($customerRole);

        Review::create([
            'user_id' => $collector3->id,
            'product_id' => $vessel->id,
            'rating' => 5,
            'body' => 'The travertine vessel is heavy and beautiful. Natural imperfections make it completely unique. Fast shipping to London.',
            'is_verified_purchase' => true,
            'status' => 'approved'
        ]);
    }
}

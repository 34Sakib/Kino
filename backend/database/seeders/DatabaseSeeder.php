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
    }
}

<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\Coupon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Role;

class EcommerceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Register default Roles
        Role::create(['name' => 'customer']);
        Role::create(['name' => 'admin']);
    }

    public function test_user_can_register_and_receive_token()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'user' => ['id', 'name', 'email'],
            'access_token',
            'token_type'
        ]);
        
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::create([
            'name' => 'Alice Smith',
            'email' => 'alice@example.com',
            'password' => bcrypt('secretpassword'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'alice@example.com',
            'password' => 'secretpassword',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['access_token', 'user']);
    }

    public function test_product_catalog_endpoints()
    {
        $category = Category::create([
            'name' => 'Stone Accents',
            'slug' => 'accessories',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Travertine Plate',
            'slug' => 'travertine-plate',
            'description' => 'Tuscan stone tray object.',
            'price' => 120.00,
            'status' => 'published',
        ]);

        $response = $this->getJson('/api/products');
        $response->assertStatus(200);
        
        // Check single product details load
        $showResponse = $this->getJson("/api/products/{$product->slug}");
        $showResponse->assertStatus(200);
        $showResponse->assertJsonFragment(['name' => 'Travertine Plate']);
    }

    public function test_checkout_stock_validation_and_deduction()
    {
        $category = Category::create([
            'name' => 'Wood Workspace',
            'slug' => 'workspace',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Nordic Writing Desk',
            'slug' => 'nordic-writing-desk',
            'description' => 'Solid European oak desk.',
            'price' => 500.00,
            'status' => 'published',
        ]);

        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'sku' => 'OAK-DESK-STD',
            'price_modifier' => 0.00,
            'attribute_values_json' => []
        ]);

        $inventory = Inventory::create([
            'variant_id' => $variant->id,
            'stock' => 5
        ]);

        // Attempting to buy 10 desks (exceeding stock of 5)
        $failResponse = $this->postJson('/api/checkout/session', [
            'items' => [
                [
                    'id' => $product->id,
                    'name' => 'Nordic Writing Desk',
                    'qty' => 10,
                    'sku' => 'OAK-DESK-STD',
                ]
            ],
            'email' => 'buyer@example.com',
            'shipping_address' => [
                'first_name' => 'Julian',
                'last_name' => 'Sterling',
                'address_line1' => 'Atelier St 42',
                'city' => 'New York',
                'zip' => '10001',
                'country' => 'US',
            ]
        ]);

        $failResponse->assertStatus(422);
        $failResponse->assertJsonFragment(['error' => 'Insufficient stock for Nordic Writing Desk. Available: 5.']);

        // Buy 2 desks (successful checkout)
        $passResponse = $this->postJson('/api/checkout/session', [
            'items' => [
                [
                    'id' => $product->id,
                    'name' => 'Nordic Writing Desk',
                    'qty' => 2,
                    'sku' => 'OAK-DESK-STD',
                ]
            ],
            'email' => 'buyer@example.com',
            'shipping_address' => [
                'first_name' => 'Julian',
                'last_name' => 'Sterling',
                'address_line1' => 'Atelier St 42',
                'city' => 'New York',
                'zip' => '10001',
                'country' => 'US',
            ]
        ]);

        $passResponse->assertStatus(200);
        $orderId = $passResponse->json('order_id');
        $paymentIntentId = $passResponse->json('payment_intent_id');

        // Confirming the order
        $confirmResponse = $this->postJson('/api/checkout/confirm', [
            'order_id' => $orderId,
            'payment_intent_id' => $paymentIntentId
        ]);

        $confirmResponse->assertStatus(200);

        // Verify stock is decremented from 5 to 3
        $inventory->refresh();
        $this->assertEquals(3, $inventory->stock);

        $this->assertDatabaseHas('orders', [
            'id' => $orderId,
            'status' => 'confirmed'
        ]);
    }
}

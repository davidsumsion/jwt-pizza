import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByText('The web\'s best pizza', { exact: true }).click();
  await page.getByRole('link', { name: 'About' }).click();

  await expect(page.getByText('The secret sauce')).toBeVisible();
  await expect(page.getByRole('main')).toContainText('The secret sauce');
});

test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('Register User', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'POST') {
      const regRes = {
        "user": {
          "name": "RANDY",
          "email": "RANDY@test.com",
          "roles": [{ "role": "diner" }],
          "id": 59
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUkFORFkiLCJlbWFpbCI6IlJBTkRZQHRlc3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJkaW5lciJ9XSwiaWQiOjU5LCJpYXQiOjE3MzkzMDE3ODd9.8QgqAwyIjgT3LEqqOnF_6r6NpLZiLkIDXpMmf-95WbU"
      };
      expect(route.request().method()).toBe('POST');
      await route.fulfill({ json: regRes });
    } else {
      const regRes = { "message": "logout successful" };
      expect(route.request().method()).toBe('DELETE');
      await route.fulfill({ json: regRes });
    }
  });

  //Register
  await page.goto('/register');
  await expect(page.getByRole('heading')).toContainText('Welcome to the party');
  await expect(page.getByRole('textbox', { name: 'Full name' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('RANDY');
  await page.getByRole('textbox', { name: 'Full name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Email address' }).fill('RANDY@test.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1234');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.goto('http://localhost:5173/');
  await expect(page.getByLabel('Global')).toContainText('R');

  //Logout
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
});

test('admin add franchise, delete franchise', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'POST') {
      const regRes = {
        "user": {
          "name": "RANDY",
          "email": "RANDY@test.com",
          "roles": [{ "role": "diner" }],
          "id": 59
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUkFORFkiLCJlbWFpbCI6IlJBTkRZQHRlc3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJkaW5lciJ9XSwiaWQiOjU5LCJpYXQiOjE3MzkzMDE3ODd9.8QgqAwyIjgT3LEqqOnF_6r6NpLZiLkIDXpMmf-95WbU"
      };
      expect(route.request().method()).toBe('POST');
      await route.fulfill({ json: regRes });
    } else if (route.request().method() === 'DELETE') {
      const regRes = { "message": "logout successful" };
      expect(route.request().method()).toBe('DELETE');
      await route.fulfill({ json: regRes });
    } else {
      const regRes = {
        "user": {
          "id": 2,
          "name": "常用名字",
          "email": "a@jwt.com",
          "roles": [
            {
              "role": "admin"
            }
          ]
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzM5MzAyMTM2fQ.EP79Z42UFeUmeXkRtcqdsavp3-9_UHy0eLT-fnf0zoU"
      }
      expect(route.request().method()).toBe('PUT');
      await route.fulfill({ json: regRes });
    }
  });

  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'POST') {
      const franchiseRes = {
        "stores": [],
        "id": 38,
        "name": "TESTADD&DELETE",
        "admins": [
          {
            "email": "RANDY@test.com",
            "id": 58,
            "name": "RANDY"
          }
        ]
      }
      expect(route.request().method()).toBe('POST');
      await route.fulfill({ json: franchiseRes });
    } else if (route.request().method() === 'GET') {
      const franchiseRes = [
        {
          "id": 38,
          "name": "TESTADD&DELETE",
          "admins": [
            {
              "id": 58,
              "name": "RANDY",
              "email": "RANDY@TEST.com"
            }
          ],
          "stores": []
        }
      ]
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: franchiseRes });
    }
  });

  await page.route('*/**/api/franchise/38', async (route) => {
    const franchiseRes = { "message": "franchise deleted" }
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: franchiseRes });
  });

  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();

  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('TESTADD&DELETE');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('RANDY@test.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
});

test('create and delte stores', async ({ page }) => {
  await page.route('*/**/api/franchise/58', async (route) => {
    const franchiseRes = [
      {
        "id": 40,
        "name": "1234",
        "admins": [
          {
            "id": 58,
            "name": "RANDY",
            "email": "RANDY@TEST.com"
          }
        ],
        "stores": [
          {
            "id": 22,
            "name": "TEST2",
            "totalRevenue": 0.5
          },
          {
            "id": 23,
            "name": "TEST1",
            "totalRevenue": 0
          }
        ]
      }
    ]
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });
  await page.route('*/**/api/franchise/40/store', async (route) => {
    const franchiseRes = { "id": 21, "franchiseId": 40, "name": "TEST1" }
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: franchiseRes });
  });
  await page.route('*/**/api/auth', async (route) => {
    const loginRes = {
      "user": {
        "id": 58,
        "name": "RANDY",
        "email": "RANDY@TEST.com",
        "roles": [
          {
            "role": "diner"
          },
          {
            "objectId": 40,
            "role": "franchisee"
          }
        ]
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsIm5hbWUiOiJSQU5EWSIsImVtYWlsIjoiUkFORFlAVEVTVC5jb20iLCJyb2xlcyI6W3sicm9sZSI6ImRpbmVyIn0seyJvYmplY3RJZCI6NDAsInJvbGUiOiJmcmFuY2hpc2VlIn1dLCJpYXQiOjE3MzkzMDU4ODV9.2viwifcfwahmNPFVQ47RwBs9xgrA1SjQbda4HbxU-cg"
    }
    expect(route.request().method()).toBe('PUT');
    await route.fulfill({ json: loginRes });
  });

  await page.goto('/franchise-dashboard');
  await page.getByRole('link', { name: 'Login', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('RANDY@test.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TEST1');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.locator('tbody')).toContainText('TEST1');
  await page.getByRole('row', { name: 'TEST1 0 ₿ Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading')).toContainText('1234');
});


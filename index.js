import express from "express"; // Import the Express library

const app = express(); // Create an instance of the Express application: server

app.use(express.json()); // middleware to parse JSON bodies

let products = []; // In-memory array to store products

// Create a new product
// Sample product data to test the API:
/*
POST http://localhost:3030/products
  {
    "name": "Coca Cola",
    "price": 50,
    "size": "50cl"
  },
    {
    "name": "Pepsi Cola",
    "price": 50,
    "size": "60cl"
  },
  {
    "name": "Big Cola",
    "price": 45,
    "size": "60cl"
  }
*/
app.post("/products", (req, res) => {
  const { name, price, size } = req.body;
  const id = Date.now().toString();

  // Check if name, price, and size are provided
  if (!name || !price || !size) {
    return res
      .status(400)
      .json({ message: "Name, price, and size are required" });
  }
  // Check if price is a number
  if (typeof price !== "number") {
    return res.status(400).json({ message: "Price must be a number" });
  }

  const newProduct = { id, name, price, size };
  products.push(newProduct);
  res
    .status(200)
    .send(`Product created successfully, ${JSON.stringify(newProduct)}`);
});

// Read all products from in-memory array
/*
 GET http://localhost:3030/products
 [
  {
    "id": "1773575313582",
    "name": "Coca Cola",
    "price": 50,
    "size": "50cl"
  },
  {
    "id": "1773575320168",
    "name": "Pepsi Cola",
    "price": 50,
    "size": "60cl"
  },
  {
    "id": "1773575334864",
    "name": "Big Cola",
    "price": 45,
    "size": "60cl"
  }
]
 */
app.get("/products", (req, res) => {
  res.json(products);
});

// Update all product details by id
/*
PUT http://localhost:3030/products/1773575313582
  {
    "name": "Coca Cola",
    "price": 60,
    "size": "75cl"
  }
*/
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, size } = req.body;

  // Check if name, price, and size are provided
  if (!name || !price || !size) {
    return res
      .status(400)
      .json({ message: "Name, price, and size are required" });
  }

  // Check if price is a number
  if (typeof price !== "number") {
    return res.status(400).json({ message: "Price must be a number" });
  }

  const productIndex = products.findIndex((p) => p.id === id);

  // If the product is not found, return a 404 error
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Update the product details with the new values
  products[productIndex] = { id, name, price, size };

  // Return the updated product as a response
  res.json(products[productIndex]);
});

// Update specific product details by id
/*
PATCH http://localhost:3030/products/1773575334864
  {
    "price": 45,
  }
*/
app.patch("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  // Check if at least one field (name or price) is provided for update
  if (!name && !price) {
    return res
      .status(400)
      .json({ message: "At least one field (name or price) is required" });
  }

  // Find the index of the product to be updated
  const productIndex = products.findIndex((p) => p.id === id);

  // If the product is not found, return a 404 error
  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Update only the provided fields (name, price) while keeping the existing values for any fields that are not provided
  products[productIndex] = { ...products[productIndex], name, price };

  // Return the updated product as a response
  res.json(products[productIndex]);
});

// Delete a product by id
// DELETE http://localhost:3030/products/1773575320168

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  // Find the product to be deleted
  const deletedProduct = products.find((p) => p.id === id);

  // If the product is not found, return a 404 error
  if (!deletedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Remove the deleted product from the array
  products = products.filter((p) => p.id !== id);

  // Return the deleted product as a response
  res.json(deletedProduct);
});

// Start the server on port 3030
app.listen(3030, () => {
  console.log("Server is running on custom port 3030");
});

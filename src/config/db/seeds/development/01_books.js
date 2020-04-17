const books = [
  { title: "Atomic Habbits", author: "James Clear" },
  { title: "Zero To One", author: "Peter Thiel & Blake Masters" },
  { title: "Principles", author: "Ray Dalio" }
];

exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex("book")
    .del()
    .then(async () => {
      // Inserts seed entries
      return knex("book").insert(books);
    });
};

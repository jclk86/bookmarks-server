module.exports = {
    PORT:process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || "development",
    API_TOKEN: process.env.API_TOKEN || '70c830a4-b613-4d07-a688-6db7b0968d94',
    DB_URL: process.env.DB_URL || 'postgresql://postgres:B3Th3B3st@localhost/bookmarks'
}
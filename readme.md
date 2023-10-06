# Voting Apps

This project is a web application built with Express in Node.js, using TypeScript as the main language, and MongoDB as the data store with Mongoose as the ODM (Object Document Mapper).

## API Collection

[Postman Collection](https://documenter.getpostman.com/view/20476303/2s9YJez2Br)

## Library List

- express
- bcryptjs
- dotenv
- jsonwebtoken
- mongoose

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/felixlambertv/be-vote.git
cd be-vote
```

### 2. Install Dependencies

```bash
npm install or yarn install
```

### 3. Copy .env.example as .env

```bash
cp .env.example .env
```

### 4. Seed the data

```bash
yarn build
yarn seed:user
```

### 4. Run the apps

```bash
yarn start
```

## Testing

To run test:

```bash
yarn test
```

## Docker Support

If Node.js or Mongo isnt set up locally, use Docker:

```bash
docker-compose up
```

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Forever API

## Installation

1. Clone project
2. Install dependencies

```
yarn install
```
3. Clone the file ```.env.template``` and rename to ```.env```
4. Change the variables in the ```.env``` file to your needs
5. Run the database
```
docker-compose up -d
```


## Running the app


### Development
```
yarn start:dev
```
### Production

```
yarn start:prod
```

### Production with Docker


```
docker-compose -f docker-compose.prod.yaml up -d
```

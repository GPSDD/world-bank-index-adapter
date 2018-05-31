# World Bank Index Adapter


This repository is the microservice that implements the World Bank Index Adapter
funcionality

1. [Getting Started](#getting-started)

## Getting Started

### OS X

**First, make sure that you have the [API gateway running
locally](https://github.com/control-tower/control-tower).**

We're using Docker which, luckily for you, means that getting the
application running locally should be fairly painless. First, make sure
that you have [Docker Compose](https://docs.docker.com/compose/install/)
installed on your machine.

```
git clone https://github.com/Vizzuality/gfw-geostore-api.git
cd world-bank-index-adapter
./adapter.sh develop
```text

You can now access the microservice through the CT gateway.

```

### Configuration

It is necessary to define these environment variables:

* CT_URL => Control Tower URL
* NODE_ENV => Environment (prod, staging, dev)

## Field correspondence


| Field in SDG Metadata     | Field in WB Metadata  | Value         |
|---------------------------|-----------------------|---------------|
| userId                    | -                     | 'published'   |
| language                  |                       | 'en'          |
| resource                  |                       |               |
| name                      | name                  |               |
| description               | sourceNote            |               |
| sourceOrganization        | -                     | 'World Bank Group' |
| dataDownloadUrl           | -                     | 'https://api.worldbank.org/v2/countries/all/indicators/:indicator?date=0000:2017&format=json&per_page=30000' with :indicator = id of indicator|
| dataSourceUrl             | -                     | 'https://data.worldbank.org/indicator/:indicator' with :indicator = id of indicator       |
| dataSourceEndpoint        |                       | 'https://api.worldbank.org/v2/countries/all/indicators/:indicator?date=0000:2017&format=json&per_page=30000' with :indicator = id of indicator|
| license                   |                       | 'CC BY 4.0'   |
| info                      | topics                |               |
| status                    | -                     | 'published'   |

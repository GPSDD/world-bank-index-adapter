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

### Cron task

This component executes a periodic task that updates the metadata of each indexed RW dataset. The task is bootstrapped  
[when the application server starts](https://github.com/GPSDD/world-bank-index-adapter/blob/master/app/src/app.js#L19). 
The task's implementation can be found on `app/src/cron/cron` and the configuration is loaded from the 
[config files](https://github.com/GPSDD/world-bank-index-adapter/blob/master/config/default.json#L18)


## Field correspondence

| Field in SDG Metadata     | Field in WB Metadata  | Value         |
|---------------------------|-----------------------|---------------|
| userId                    | -                     | 'published'   |
| language                  |                       | 'en'          |
| resource                  |                       |               |
| name                      | name                  |               |
| description               | sourceNote            |               |
| sourceOrganization        | -                     | 'World Bank Group' |
| dataDownloadUrl           | -                     | 'https://api.worldbank.org/v2/countries/all/indicators/:indicator?format=json&per_page=30000' with :indicator = id of indicator|
| dataSourceUrl             | -                     | 'https://data.worldbank.org/indicator/:indicator' with :indicator = id of indicator       |
| dataSourceEndpoint        |                       | 'https://api.worldbank.org/v2/countries/all/indicators/:indicator?format=json&per_page=30000' with :indicator = id of indicator|
| license                   |                       | 'CC BY 4.0'   |
| info                      | topics                |               |
| status                    | -                     | 'published'   |

## Dataset tagging strategy


### Taxonomy

World Bank datasets have "topics" associated with them, which this connector uses to tag the index datasets. 
Additionally, each WB dataset is tagged with the "worldbank" tag.

### Graph

World Bank datasets do not have a direct match to the graph elements, and thus no attempt at matching them is made. 


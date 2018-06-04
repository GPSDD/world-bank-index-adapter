const ROLES = {
    USER: {
        id: '1a10d7c6e0a37126611fd7a7',
        role: 'USER',
        provider: 'local',
        email: 'user@control-tower.org',
        extraUserData: {
            apps: [
                'rw',
                'gfw',
                'gfw-climate',
                'prep',
                'aqueduct',
                'forest-atlas',
                'data4sdgs'
            ]
        }
    },
    MANAGER: {
        id: '1a10d7c6e0a37126611fd7a7',
        role: 'MANAGER',
        provider: 'local',
        email: 'user@control-tower.org',
        extraUserData: {
            apps: [
                'rw',
                'gfw',
                'gfw-climate',
                'prep',
                'aqueduct',
                'forest-atlas',
                'data4sdgs'
            ]
        }
    },
    ADMIN: {
        id: '1a10d7c6e0a37126611fd7a7',
        role: 'ADMIN',
        provider: 'local',
        email: 'user@control-tower.org',
        extraUserData: {
            apps: [
                'rw',
                'gfw',
                'gfw-climate',
                'prep',
                'aqueduct',
                'forest-atlas',
                'data4sdgs'
            ]
        }
    }
};

const WB_DATASET_CREATE_REQUEST = {
    connector: {
        __v: 0,
        name: 'Seasonal variability',
        slug: 'Seasonal-variability_17',
        connectorType: 'rest',
        provider: 'worldbank',
        userId: '1a10d7c6e0a37126611fd7a7',
        updatedAt: '2018-06-01T11:04:47.231Z',
        createdAt: '2018-06-01T11:04:47.231Z',
        legend: {
            nested: [],
            country: [],
            region: [],
            date: []
        },
        taskId: null,
        'protected': false,
        geoInfo: false,
        env: 'production',
        sandbox: false,
        published: true,
        errorMessage: null,
        verified: false,
        overwrite: false,
        status: 'pending',
        tableName: 'per_si_allsi.cov_pop_tot',
        connectorUrl: null,
        attributesPath: null,
        dataPath: null,
        application: 'data4sdgs',
        type: null,
        _id: '47e9a243-9aea-44e5-94fc-44866e83b0a7',
        id: '47e9a243-9aea-44e5-94fc-44866e83b0a7',
        connector_url: null,
        attributes_path: null,
        data_path: null,
        table_name: 'per_si_allsi.cov_pop_tot'
    },
    userId: '1a10d7c6e0a37126611fd7a7',
    loggedUser: {
        id: 'microservice'
    }
};

const WB_API_METADATA = {
    id: 'per_si_allsi.cov_pop_tot',
    name: 'Coverage of social insurance programs (% of population)',
    unit: '',
    source: {
        id: '2',
        value: 'World Development Indicators'
    },
    sourceNote: 'Coverage of social insurance programs shows the percentage of population participating in programs that provide old age contributory pensions (including survivors and disability) and social security and health insurance benefits (including occupational injury benefits, paid sick leave, maternity and other social insurance). Estimates include both direct and indirect beneficiaries.',
    sourceOrganization: 'ASPIRE: The Atlas of Social Protection - Indicators of Resilience and Equity, The World Bank. Data are based on national representative household surveys. (datatopics.worldbank.org/aspire/)',
    topics: [
        {
            id: '10',
            value: 'Social Protection & Labor'
        }
    ]
};

const WB_API_METADATA_RESPONSE = [
    {
        page: 1,
        pages: 1,
        per_page: '50',
        total: 1
    },
    [
        WB_API_METADATA
    ]
];

module.exports = {
    ROLES,
    WB_API_METADATA_RESPONSE,
    WB_DATASET_CREATE_REQUEST,
    WB_API_METADATA
}

export const createTestDB = `

    --  USER

    CREATE TABLE IF NOT EXISTS user_app
    (
        id character varying(256) NOT NULL,
        user_name character varying(256),
        street character varying(256),
        street_number character varying(256),
        zip_code character varying(5),
        city character varying(256),
        user_since timestamp without time zone,
        customer_since timestamp without time zone,
        name character varying(256),
        province_id integer,
        CONSTRAINT user_app_pkey PRIMARY KEY (id)
    );


    --  VISIT

    CREATE TABLE IF NOT EXISTS visit
    (
        id character varying(256) NOT NULL,
        user_app_id character varying(256),
        date date,
        "time" time without time zone,
        time_spent time without time zone,
        full_timestamp timestamp with time zone,
        device character varying(256),
        application character varying(256),
        CONSTRAINT visit_pkey PRIMARY KEY (id),
        CONSTRAINT fk_child_user_app_id FOREIGN KEY (user_app_id)
            REFERENCES user_app (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO ACTION
    );


    --  PAGEVIEW

    CREATE TABLE IF NOT EXISTS page_view
    (
        id character varying(256) NOT NULL,
        visit_id character varying(256),
        date date,
        "time" time without time zone,
        time_spent time without time zone,
        full_timestamp timestamp with time zone,
        device character varying(256),
        application character varying(256),
        page_name character varying(256),
        CONSTRAINT page_view_pkey PRIMARY KEY (id),
        CONSTRAINT fk_child_visit_id FOREIGN KEY (visit_id)
            REFERENCES visit (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO ACTION
    );
`;

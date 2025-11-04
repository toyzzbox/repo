--
-- PostgreSQL database dump
--

\restrict pHrEhYAjJxps3GW04asgNfxGFNk2fISvcMP7cYH6c672IG4yh9SyeeaIVuWqxQF

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: CartStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CartStatus" AS ENUM (
    'ACTIVE',
    'ABANDONED',
    'SAVED',
    'CHECKEDOUT',
    'COMPLETED'
);


ALTER TYPE public."CartStatus" OWNER TO postgres;

--
-- Name: InvoiceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceType" AS ENUM (
    'INDIVIDUAL',
    'CORPORATE'
);


ALTER TYPE public."InvoiceType" OWNER TO postgres;

--
-- Name: MediaType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MediaType" AS ENUM (
    'image',
    'video'
);


ALTER TYPE public."MediaType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'SHIPPED',
    'COMPLETED',
    'CANCELED',
    'RETURNED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: VerificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VerificationType" AS ENUM (
    'EMAIL_VERIFICATION',
    'PASSWORD_RESET',
    'TWO_FACTOR'
);


ALTER TYPE public."VerificationType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "fullName" text NOT NULL,
    city text NOT NULL,
    district text NOT NULL,
    "postalCode" text NOT NULL,
    "addressLine" text NOT NULL,
    phone text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Address" OWNER TO postgres;

--
-- Name: Attribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attribute" (
    id text NOT NULL,
    name text NOT NULL,
    "groupId" text NOT NULL
);


ALTER TABLE public."Attribute" OWNER TO postgres;

--
-- Name: AttributeGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AttributeGroup" (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."AttributeGroup" OWNER TO postgres;

--
-- Name: Brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Brand" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Brand" OWNER TO postgres;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text,
    status public."CartStatus" DEFAULT 'ACTIVE'::public."CartStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "sessionId" text,
    "expiresAt" timestamp(3) without time zone
);


ALTER TABLE public."Cart" OWNER TO postgres;

--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "cartId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    price double precision NOT NULL
);


ALTER TABLE public."CartItem" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Favorite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Favorite" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Favorite" OWNER TO postgres;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."InvoiceType" DEFAULT 'INDIVIDUAL'::public."InvoiceType" NOT NULL,
    "fullName" text,
    "tcNumber" text,
    "companyName" text,
    "taxOffice" text,
    "taxNumber" text,
    "addressLine" text NOT NULL,
    city text NOT NULL,
    district text NOT NULL,
    "postalCode" text,
    email text,
    phone text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO postgres;

--
-- Name: Media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Media" (
    id text NOT NULL,
    type public."MediaType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "altText" text,
    description text,
    title text
);


ALTER TABLE public."Media" OWNER TO postgres;

--
-- Name: MediaFile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MediaFile" (
    id text NOT NULL,
    url text NOT NULL,
    format text,
    width integer,
    height integer,
    size integer,
    quality text,
    "mediaId" text NOT NULL
);


ALTER TABLE public."MediaFile" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text NOT NULL,
    total double precision NOT NULL,
    subtotal double precision NOT NULL,
    "shippingCost" double precision NOT NULL,
    "shippingName" text NOT NULL,
    "shippingPhone" text NOT NULL,
    "shippingAddress" text NOT NULL,
    "shippingCity" text NOT NULL,
    "deliveryMethod" text NOT NULL,
    "paymentMethod" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "addressId" text,
    "shippingDistrict" text NOT NULL,
    "shippingPostalCode" text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "deliveryDate" timestamp(3) without time zone,
    "invoiceId" text
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    price double precision NOT NULL,
    "productName" text NOT NULL,
    "productImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    discount double precision,
    "groupId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    serial text,
    sku text,
    stock integer,
    description text,
    views integer DEFAULT 0 NOT NULL,
    barcode text
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: ProductGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductGroup" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text
);


ALTER TABLE public."ProductGroup" OWNER TO postgres;

--
-- Name: ProductMedia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductMedia" (
    "productId" text NOT NULL,
    "mediaId" text NOT NULL,
    "order" integer NOT NULL
);


ALTER TABLE public."ProductMedia" OWNER TO postgres;

--
-- Name: _AttributeToMedia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_AttributeToMedia" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_AttributeToMedia" OWNER TO postgres;

--
-- Name: _BrandToMedia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_BrandToMedia" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_BrandToMedia" OWNER TO postgres;

--
-- Name: _CategoryToMedia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_CategoryToMedia" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_CategoryToMedia" OWNER TO postgres;

--
-- Name: _ProductAttribute; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProductAttribute" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProductAttribute" OWNER TO postgres;

--
-- Name: _ProductToBrand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProductToBrand" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProductToBrand" OWNER TO postgres;

--
-- Name: _ProductToCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_ProductToCategory" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ProductToCategory" OWNER TO postgres;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    "userId" text NOT NULL,
    scope text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id text NOT NULL,
    "accessToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "accountId" text,
    "idToken" text,
    password text,
    "providerId" text,
    "refreshToken" text,
    "refreshTokenExpiresAt" timestamp(3) without time zone
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id text NOT NULL,
    content text NOT NULL,
    rating integer NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: login_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_attempts (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text,
    email text NOT NULL,
    "ipAddress" text NOT NULL,
    "userAgent" text,
    success boolean NOT NULL,
    reason text
);


ALTER TABLE public.login_attempts OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    "userId" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    id text NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "sessionToken" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastAccessAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "failedLoginCount" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "lastLoginAt" timestamp(3) without time zone,
    "lastLoginIp" text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verifications (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    type public."VerificationType",
    used boolean DEFAULT false
);


ALTER TABLE public.verifications OWNER TO postgres;

--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Address" (id, "userId", "fullName", city, district, "postalCode", "addressLine", phone, "isDefault", "createdAt", "updatedAt") FROM stdin;
cmgp0op9r0001pc10l1g7amzk	cmemlxa9m0002p80z9aigtoa2	deneme	21221	122121	212121	122121	122121	f	2025-10-13 10:55:34.383	2025-10-13 10:55:34.383
\.


--
-- Data for Name: Attribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attribute" (id, name, "groupId") FROM stdin;
\.


--
-- Data for Name: AttributeGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AttributeGroup" (id, name) FROM stdin;
cmc5vwe7w0000qp108pzge4qu	Cinsiyet
cmc79btua0000rv10r4um77wx	Yaş Aralığı
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Brand" (id, name, slug, description, "createdAt", "updatedAt") FROM stdin;
cmcsv61dh0009oa107ejabpmo	Dede	dede	Dede	2025-07-07 08:53:20.886	2025-07-07 08:57:19.651
cmcrol5pr000npb0zaa3ywia6	Babycim	babycim	Babycim	2025-07-06 13:01:22.862	2025-07-07 13:18:37.004
cmc3walor000lny10f5blvbup	Cicciobello	cicciobello	Cicciobello	2025-06-19 21:30:39.051	2025-07-07 13:20:04.11
cmcvrrptq0000o5101n6n420j	Mattel Games	mattel-games	Mattel Games	2025-07-09 09:41:32.414	2025-07-10 06:06:45.123
cmbak7nzv000cnv109dnryixo	Vardem	vardem	vardem	2025-05-30 08:47:07.579	2025-06-24 15:00:57.417
cmbak745a000bnv10uigbk0aa	Hot Wheels	hot-wheels	hot wheels	2025-05-30 08:46:41.855	2025-06-24 15:01:14.126
cmcw6vuhu0000ll10nn796sgz	Maşa ile Koca Ayı	maa-ile-koca-ay	Maşa ile Koca Ayı	2025-07-09 16:44:39.33	2025-07-10 06:08:16.131
cmc3uzveg000ppb10aeu86mq4	Baby Clementoni	baby-clementoni	fdsd	2025-06-19 20:54:18.808	2025-07-01 08:29:47.43
cmcw3p6gq0005mn101zz172i5	Ravensburger	ravensburger	Ravensburger	2025-07-09 15:15:29.401	2025-07-10 06:09:23.367
cmc3uuk4u000mpb10vqc7yzz1	Clementoni	clementoni	dsldlsa	2025-06-19 20:50:10.925	2025-07-01 08:32:17.196
cmbak6wj8000anv10gevl1zqv	Fisher Price	fisher-price	fisher price	2025-05-30 08:46:31.989	2025-07-01 08:33:43.225
cmcrfa8nk0001k010xpt1twm6	Enchantimals	enchantimals	Enchantimals	2025-07-06 08:40:56.913	2025-07-10 06:09:58.244
cmc3wz4aj000wny105t1yu19y	Rastar	rastar	Rastar	2025-06-19 21:49:42.89	2025-07-01 08:35:53.193
cmcvttbru0007le10eou08agg	Tomy	tomy	tomy	2025-07-09 10:38:46.746	2025-07-10 06:13:37.906
cmc3xl5ih0012ny10crpw18b8	Nerf	nerf	Nerf	2025-06-19 22:06:50.919	2025-07-01 08:37:10.449
cmc3vv38u000bny10dc5gqvyh	Smile Games	smile-games	dsaasd	2025-06-19 21:18:35.31	2025-07-01 08:38:50.994
cmcvt59qp0000le106zfk9gfm	Hasbro Gaming	hasbro-gaming	hasbro gaming	2025-07-09 10:20:04.359	2025-07-10 06:14:57.008
cmbak6rn90009nv10920aaoe3	Barbie	barbie	barbie	2025-05-30 08:46:25.654	2025-07-04 08:25:12.56
cmbak829b000dnv10x2sakouc	Lego	lego	lego	2025-05-30 08:47:26.064	2025-07-04 11:06:40.02
cmcrexshb0000mi107dtaceml	Baby Alive	baby-alive	baby alive	2025-07-06 08:31:16.078	2025-07-06 08:53:57.728
cmbbxq26f0005mo10yj4kjkrb	L.O.L Suprise	revacandle	lolsuprise	2025-05-31 07:53:06.951	2025-07-07 07:44:49.238
cmd4a0gao0000te0z7dedv8hn	Monster High	monster-high	Monster High	2025-07-15 08:34:22.464	2025-07-21 13:35:06.382
cmd4avvd40008qj0z4805i854	Frozen	frozen	Frozen	2025-07-15 08:58:48.328	2025-08-28 10:34:49.092
\.


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cart" (id, "userId", status, "createdAt", "updatedAt", "sessionId", "expiresAt") FROM stdin;
cmg49xiyk0000rp10s5ziq0ox	\N	ACTIVE	2025-09-28 22:31:12.957	2025-09-28 22:31:12.957	79e4b2a5-5ee5-4c94-abfe-cd0bd254716d	2025-10-05 22:31:12.954
cmg4bb6nm0000p410msfxho3i	\N	ACTIVE	2025-09-28 23:09:49.81	2025-09-28 23:09:49.81	e3129021-7e90-457a-96a2-91d68710ba60	2025-10-05 23:09:49.808
cmg4wlumm0001n010wtjs6ot2	cmemlxa9m0002p80z9aigtoa2	CHECKEDOUT	2025-09-29 09:05:59.372	2025-10-01 14:59:49.601	\N	2025-12-28 09:05:59.369
cmg84gok90007ow0zp1ew0m9r	cmemlxa9m0002p80z9aigtoa2	CHECKEDOUT	2025-10-01 15:09:13.688	2025-10-01 15:09:54.243	\N	2025-12-30 15:09:13.686
cmg85c2j5000gow0zd8ip3kxg	\N	ACTIVE	2025-10-01 15:33:38.129	2025-10-01 15:33:38.129	ff242c68-3a6f-46a2-abaa-7a5a484843b8	2025-10-08 15:33:38.126
cmg8dtk6o000sow0zuq0hkjzn	cmemlxa9m0002p80z9aigtoa2	CHECKEDOUT	2025-10-01 19:31:11.038	2025-10-04 08:16:09.93	\N	2025-12-30 19:31:10.921
cmgc213530001qv0zae8r15ki	cmemlxa9m0002p80z9aigtoa2	CHECKEDOUT	2025-10-04 09:12:11.56	2025-10-04 09:12:48.787	\N	2026-01-02 09:12:11.558
cmgc26bm6000mqv0zffpo3uz4	cmgc25oib000gqv0zbucxfmhr	CHECKEDOUT	2025-10-04 09:16:15.822	2025-10-04 09:16:36.088	\N	2026-01-02 09:16:15.819
cmgca0jv20000s3104w2xrwha	\N	ACTIVE	2025-10-04 12:55:43.503	2025-10-04 12:55:43.503	d438af85-2251-42bc-9953-ab763d8d72f3	2025-10-11 12:55:43.501
cmgezikcw0001pg0z9frayls9	cmgc25oib000gqv0zbucxfmhr	ACTIVE	2025-10-06 10:25:06.704	2025-10-06 10:25:06.704	\N	2026-01-04 10:25:06.702
cmggg0q320000k40zlkffwe1a	\N	ACTIVE	2025-10-07 10:54:53.967	2025-10-07 10:54:53.967	c385a2da-a421-4a02-8ce9-ad5a78b6c8cd	2025-10-14 10:54:53.965
cmggxtyzy0003o10z8evw80so	cmemlxa9m0002p80z9aigtoa2	ACTIVE	2025-10-07 19:13:32.015	2025-10-07 19:13:32.015	\N	2026-01-05 19:13:32.013
cmgjq3ojb0000t90zmf28s6fp	\N	ACTIVE	2025-10-09 18:00:26.613	2025-10-09 18:00:26.613	1eb72ec1-face-4d58-8d56-a97727506306	2025-10-16 18:00:26.611
cmgt4ltsb0002o1109ivx53l0	\N	ACTIVE	2025-10-16 07:56:23.435	2025-10-16 07:56:23.435	a3c582cd-8693-420c-8a3b-1d219a409d4e	2025-10-23 07:56:23.434
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CartItem" (id, "cartId", "productId", quantity, "createdAt", "updatedAt", price) FROM stdin;
cmgf9h8570001tc105363h0hc	cmgca0jv20000s3104w2xrwha	cmcrkg8zi0006pb0z32v9i068	1	2025-10-06 15:04:00.379	2025-10-06 15:04:00.379	1799
cmgfcbvby0001o80zr00zl3zy	cmgezikcw0001pg0z9frayls9	cmdbmbs6l0003nw0z6kh2jmlr	1	2025-10-06 16:23:49.342	2025-10-06 16:23:49.342	4000
cmggg1lpl0004k40z47nzzvmr	cmggg0q320000k40zlkffwe1a	cmcrkg8zi0006pb0z32v9i068	1	2025-10-07 10:55:34.953	2025-10-07 10:55:34.953	1799
cmggxtnpz0001o10zuiep21vu	cmgca0jv20000s3104w2xrwha	cmdcto4b00006pc0zn5uni77u	1	2025-10-07 19:13:17.399	2025-10-07 19:13:17.399	3000
cmggxtz0s0005o10z0nnmoj4f	cmggxtyzy0003o10z8evw80so	cmcrksxem0007pb0zbtaeyw0f	1	2025-10-07 19:13:32.044	2025-10-07 19:13:32.044	1249
cmg4bek6o000ap410ftz5jllz	cmg4bb6nm0000p410msfxho3i	cmcrkg8zi0006pb0z32v9i068	1	2025-09-28 23:12:27.312	2025-09-28 23:12:27.312	1799
cmg4bif43000cp410ey4ehzqv	cmg4bb6nm0000p410msfxho3i	cmcrksxem0007pb0zbtaeyw0f	1	2025-09-28 23:15:27.363	2025-09-28 23:15:27.363	1249
cmgi8noq30005qd102121rdgw	cmggxtyzy0003o10z8evw80so	cmc34bwuh0000pj10yz4xywma	1	2025-10-08 17:04:20.715	2025-10-08 17:04:20.715	1300
cmgjq3ojx0002t90z7zfoczl8	cmgjq3ojb0000t90zmf28s6fp	cmdbmbs6l0003nw0z6kh2jmlr	1	2025-10-09 18:00:26.637	2025-10-09 18:00:26.637	4000
cmgl8ryzp0001qc10drd8sgja	cmgca0jv20000s3104w2xrwha	cmd4bnt4u000hqj0zmtifxckr	1	2025-10-10 19:30:59.173	2025-10-10 19:30:59.173	850
cmglx3idj0005qc10k9jo3vbg	cmggxtyzy0003o10z8evw80so	cmdd4taup0013qo0zeomf6yqb	1	2025-10-11 06:51:48.295	2025-10-11 06:51:48.295	700
cmgt4ltsw0004o110qz7wj61t	cmgt4ltsb0002o1109ivx53l0	cmd4br3r5000jqj0zsg2zga21	1	2025-10-16 07:56:23.456	2025-10-16 07:56:23.456	850
cmg4vhrjf000bli0zgmwxipg8	cmg49xiyk0000rp10s5ziq0ox	cmfs54n5g0005nv0i8fq4g8x1	10	2025-09-29 08:34:49.132	2025-09-29 08:45:41.133	10
cmg4wlunj0003n010i3s4av5q	cmg4wlumm0001n010wtjs6ot2	cmd4bnt4u000hqj0zmtifxckr	1	2025-09-29 09:05:59.407	2025-09-29 09:05:59.407	850
cmg5lsvvi0006o310ketpu4xm	cmg4wlumm0001n010wtjs6ot2	cmcrkg8zi0006pb0z32v9i068	1	2025-09-29 20:51:17.982	2025-09-29 20:51:17.982	1799
cmg6ej71b0001o410gakbwyps	cmg49xiyk0000rp10s5ziq0ox	cmdbo1n5b0000tf0zlgllngyl	1	2025-09-30 10:15:34.751	2025-09-30 10:15:34.751	1050
cmg4xgihz0005n0107jg98q56	cmg4wlumm0001n010wtjs6ot2	cmdbmbs6l0003nw0z6kh2jmlr	3	2025-09-29 09:29:49.991	2025-09-30 11:09:19.518	4000
cmg84gym3000bow0ztcnt5q4q	cmg84gok90007ow0zp1ew0m9r	cmcrksxem0007pb0zbtaeyw0f	1	2025-10-01 15:09:26.716	2025-10-01 15:09:26.716	1249
cmg85c2jh000iow0zj18idtq3	cmg85c2j5000gow0zd8ip3kxg	cmfs54n5g0005nv0i8fq4g8x1	1	2025-10-01 15:33:38.142	2025-10-01 15:33:38.142	10
cmg8dtmsi000uow0zclupm6h3	cmg8dtk6o000sow0zuq0hkjzn	cmcrksxem0007pb0zbtaeyw0f	1	2025-10-01 19:31:14.444	2025-10-01 19:31:14.444	1249
cmgc213630003qv0z88b5r03r	cmgc213530001qv0zae8r15ki	cmc34bwuh0000pj10yz4xywma	1	2025-10-04 09:12:11.596	2025-10-04 09:12:11.596	1300
cmgc26bnf000oqv0zxj8ty3vi	cmgc26bm6000mqv0zffpo3uz4	cmcvwikgf0009qp10qjb5hm91	1	2025-10-04 09:16:15.868	2025-10-04 09:16:15.868	1300
cmgca0jvl0002s3103xo1md5u	cmgca0jv20000s3104w2xrwha	cmcrksxem0007pb0zbtaeyw0f	1	2025-10-04 12:55:43.521	2025-10-04 12:55:43.521	1249
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, slug, name, description, "parentId", "createdAt", "updatedAt", "order") FROM stdin;
cmc3vok0z0009ny10fzwfdtdg	lego-ve-yapim-oyuncaklari	Lego ve Yapım Oyuncakları		cmbak4igf0002nv108nyqh4tv	2025-06-19 21:13:30.467	2025-07-01 16:43:52.468	0
cmc3uposx000jpb10iqwfqq2w	aktivite-masasi	Aktivite Masası		cmc3sfvsn000ipb108y6k1d78	2025-06-19 20:46:23.696	2025-07-01 16:44:21.775	0
cmc3vwv0x000eny109do3a4gk	zeka-kupler	Zeka Küpler		cmc3vhnw00002ny10sgumtihu	2025-06-19 21:19:57.969	2025-06-19 21:52:52.944	0
cmbwfg39e0001mp1071joskey	model	Model Arabalar	model	cmbak59e50004nv10gjsv0sot	2025-06-14 16:04:38.401	2025-07-01 17:19:10.399	0
cmbwfm9ui0000qm10jigjv6zd	oyun-setleri	Oyun Setleri	deed	cmbak4igf0002nv108nyqh4tv	2025-06-14 16:09:26.874	2025-07-01 17:19:51.339	0
cmcvt8s0u0002le10y7we9miw	i-lk-yas-oyuncaklari	İlk Yaş Oyuncakları	İlk Yaş Oyuncakları	cmc3sfvsn000ipb108y6k1d78	2025-07-09 10:22:48.031	2025-07-09 10:22:48.031	0
cmc3sfvsn000ipb108y6k1d78	anne-bebek	Anne & Bebek	ekmkfewmkfwemk	\N	2025-06-19 19:42:46.967	2025-07-01 17:20:41.305	0
cmc3wfgyz000nny10vjzoywn5	oyun-halisi	Oyun Halısı		cmc3sfvsn000ipb108y6k1d78	2025-06-19 21:34:26.22	2025-07-01 11:14:10.927	0
cmc3wteww000tny10gjglmf7v	kiz-oyun-setleri	Kız Oyun Setleri	dsffs	cmbwfm9ui0000qm10jigjv6zd	2025-06-19 21:45:16.737	2025-07-01 11:15:25.372	0
cmc3vkal70006ny10juvtbllv	kutu-oyunlari	Kutu Oyunları		cmbak4igf0002nv108nyqh4tv	2025-06-19 21:10:11.612	2025-07-01 16:40:01.9	0
cmc3xt0lo0015ny10t7co3k2h	scooterlar	Scooterlar		cmc3xsajv0014ny109w98xco4	2025-06-19 22:12:57.803	2025-07-01 16:40:43.292	0
cmc3v465d000spb108x2vlrwz	donence-ve-projektorler	Dönence ve Projektörler		cmc3sfvsn000ipb108y6k1d78	2025-06-19 20:57:39.342	2025-07-01 16:42:58.104	0
cmcvpwhz50000ml10sjni4jy5	fonksiyonlu-et-bebekler	Fonksiyonlu Et Bebekler		cmbak5lg80006nv10ufvv8ys7	2025-07-09 08:49:16.289	2025-07-09 10:58:44.286	0
cmc3v34qe000rpb109jvg1p7y	cingirak-ve-dislikler	Çıngırak ve Dişlikler	fsa	cmc3sfvsn000ipb108y6k1d78	2025-06-19 20:56:50.871	2025-07-01 16:49:10.276	0
cmc3xu9f10017ny10hw20ior6	oyun-cadirlari	Oyun Çadırları		cmc3xsajv0014ny109w98xco4	2025-06-19 22:13:55.884	2025-07-01 16:51:29.436	0
cmc3vle0r0008ny10475rr28b	cocuk-kutu-oyunlari	Çocuk Kutu Oyunları		cmc3vkal70006ny10juvtbllv	2025-06-19 21:11:02.715	2025-07-01 16:52:21.289	0
cmc3xi3po0010ny10mhqoa2hc	soft-mermili-silahlar	Soft Mermili Silahlar		cmc3viyzk0004ny10js8bw2ae	2025-06-19 22:04:28.602	2025-07-01 16:53:12.983	0
cmc3xgtqg000zny10pd51mtal	su-tabancalari	Su Tabancaları		cmc3viyzk0004ny10js8bw2ae	2025-06-19 22:03:29.004	2025-07-01 16:58:20.077	0
cmc3xt9e20016ny1036o5b5n7	patenler	Patenler		cmc3xsajv0014ny109w98xco4	2025-06-19 22:13:09.172	2025-07-01 17:00:23.72	0
cmc3uw1wc000npb10c4c9v8b1	banyo-oyuncaklari	Banyo Oyuncakları		cmc3sfvsn000ipb108y6k1d78	2025-06-19 20:51:20.602	2025-07-01 17:05:36.176	0
cmc3xa3gt000yny10bpfze0h7	surtmeli-araclar	Sürtmeli Araçlar		cmbak59e50004nv10gjsv0sot	2025-06-19 21:58:15.029	2025-07-01 17:09:16.548	0
cmc3vjj0a0005ny10xh5sju2i	puzzle	Puzzle	FDSFDS	cmbak4igf0002nv108nyqh4tv	2025-06-19 21:09:35.866	2025-07-01 19:03:53.043	0
cmc3xsajv0014ny109w98xco4	spor-outdoor	Spor & Outdoor	Spor & Outdoor	\N	2025-06-19 22:12:24.015	2025-07-01 17:16:47.026	0
cmc3vhnw00002ny10sgumtihu	egitici-oyuncaklar	Eğitici Oyuncaklar	adsdsa	cmbak4igf0002nv108nyqh4tv	2025-06-19 21:08:08.865	2025-07-01 17:17:18.518	0
cmbwfp0bf0002qm10aqcsmmco	ahsap-oyuncaklar	Ahşap Oyuncaklar		cmc3vhnw00002ny10sgumtihu	2025-06-14 16:11:34.491	2025-07-01 19:14:20.915	0
cmbbxn2hj0002mo10apj7zda8	hediyelik	Hediyelik	hediyelik	\N	2025-05-31 07:50:47.382	2025-07-01 17:17:43.463	0
cmc3vsde7000any10xa7hrli7	erkek-oyun-setleri	Erkek Oyun Setleri		cmbwfm9ui0000qm10jigjv6zd	2025-06-19 21:16:28.495	2025-07-01 17:18:04.635	0
cmcvulljn0000o70zr5wojbtl	elektronik	Elektronik		\N	2025-07-09 11:00:45.779	2025-07-09 11:00:45.779	0
cmbak5lg80006nv10ufvv8ys7	oyuncak-bebekler	Oyuncak Bebekler	oyuncak bebekler	cmbak4igf0002nv108nyqh4tv	2025-05-30 08:45:30.959	2025-07-01 19:19:38.715	0
cmbak59e50004nv10gjsv0sot	oyuncak-arabalar	Oyuncak Arabalar	<p>fsddfs</p>	cmbak4igf0002nv108nyqh4tv	2025-05-30 08:45:15.341	2025-07-01 19:19:52.988	0
cmbak4igf0002nv108nyqh4tv	oyuncaklar	Oyuncaklar	oyuncaklar	\N	2025-05-30 08:44:40.432	2025-07-01 19:20:07.29	0
cmbbxomq90004mo10gj6xdgbu	hareketli-sesli-hayvanlar	Hareketli Sesli Hayvanlar		cmc3vibio0003ny10sy1p4pk7	2025-05-31 07:52:00.273	2025-07-01 19:21:37.229	0
cmc3viyzk0004ny10js8bw2ae	oyuncak-silahlar	Oyuncak Silahlar		cmbak4igf0002nv108nyqh4tv	2025-06-19 21:09:09.92	2025-07-01 19:23:18.545	0
cmc3vkwtr0007ny100ur0o78z	yetiskin-aile-kutu-oyunlari	Yetişkin Aile Kutu Oyunları		cmc3vkal70006ny10juvtbllv	2025-06-19 21:10:40.432	2025-07-09 08:46:37.743	0
cmc3vibio0003ny10sy1p4pk7	pelus-oyuncaklar	Peluş Oyuncaklar		cmbak4igf0002nv108nyqh4tv	2025-06-19 21:08:39.504	2025-07-09 08:48:01.58	0
cmcvpwxjs0001ml10n1n57ut7	bez-bebekler	Bez Bebekler		cmbak5lg80006nv10ufvv8ys7	2025-07-09 08:49:36.472	2025-07-09 08:49:36.472	0
cmcvpxfkk0002ml104639hnp3	manken-bebekler	Manken Bebekler		cmbak5lg80006nv10ufvv8ys7	2025-07-09 08:49:59.828	2025-07-09 08:49:59.828	0
cmcvpybvu0003ml10ljli7bbq	koleksiyon-bebekler	Koleksiyon Bebekler		cmbak5lg80006nv10ufvv8ys7	2025-07-09 08:50:41.706	2025-07-09 08:50:41.706	0
cmcvum4nw0002o70zh4wun6mr	kulakliklar	Kulaklıklar		cmcvulljn0000o70zr5wojbtl	2025-07-09 11:01:10.556	2025-07-09 11:01:40.484	0
cmcvum0l60001o70zn8ql9lpn	piller	Piller		cmcvulljn0000o70zr5wojbtl	2025-07-09 11:01:05.274	2025-07-09 11:02:07.522	0
cmbx961pg0000p810jfbe7atc	muzik-aletleri	Müzik Aletleri	denemek	cmbak4igf0002nv108nyqh4tv	2025-06-15 05:56:38.308	2025-08-29 08:30:35.707	0
cmcvtabq70003le10b6s3arpu	yurutecler-ve-yurume-arkadaslari	Yürüteçler ve Yürüme Arkadaşları		cmc3sfvsn000ipb108y6k1d78	2025-07-09 10:24:00.224	2025-07-10 05:15:02.913	0
cmcx4up1r0000p010q47cxfm9	lisansli-peluslar	Lisanslı Peluşlar		cmc3vibio0003ny10sy1p4pk7	2025-07-10 08:35:32.559	2025-07-10 08:35:32.559	0
cmd8moqsu0005p80z2ggr28ve	hayvan-figurleri	Hayvan Figürleri		cmd8mnjfv0004p80zkspewpkm	2025-07-18 09:40:15.919	2025-07-18 09:40:15.919	0
cmcvt7ihq0001le108zt6oery	eglen-ve-ogren-oyuncaklari	Eğlen ve Öğren Oyuncakları		cmc3sfvsn000ipb108y6k1d78	2025-07-09 10:21:49.022	2025-08-28 07:19:42.688	0
cmbak64fx0008nv10yof20rr1	uzaktan-kumandali-arabalar	Kumandalı Arabalar	kumandalı arabalar	cmbak59e50004nv10gjsv0sot	2025-05-30 08:45:55.581	2025-09-08 13:11:16.509	0
cmd8mnjfv0004p80zkspewpkm	figur-oyuncaklar	Figür Oyuncaklar	Figür Oyuncaklar	cmbak4igf0002nv108nyqh4tv	2025-07-18 09:39:19.723	2025-10-06 17:32:29.007	0
cmgg9i7am0000mn10iwhgnqfj	okul-kirtasiye	Okul & Kırtasiye	okul kırtasiye ürünleri	\N	2025-10-07 07:52:32.11	2025-10-07 07:52:32.11	0
\.


--
-- Data for Name: Favorite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Favorite" (id, "userId", "productId", "createdAt") FROM stdin;
cmgi8lf680001qd101ipyv7fg	cmemlxa9m0002p80z9aigtoa2	cmdbmbs6l0003nw0z6kh2jmlr	2025-10-08 17:02:35.017
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invoice" (id, "userId", type, "fullName", "tcNumber", "companyName", "taxOffice", "taxNumber", "addressLine", city, district, "postalCode", email, phone, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Media" (id, type, "createdAt", "updatedAt", "altText", description, title) FROM stdin;
cmbak453k0000nv100ieq3kzk	image	2025-05-30 08:44:23.121	2025-05-30 08:44:23.121	\N	\N	\N
cmbo28vkx0003lf10tb1m5yzi	image	2025-06-08 19:32:57.441	2025-06-08 19:32:57.441	\N	\N	\N
cmbp26kwb0000pf10tikxxmd9	image	2025-06-09 12:18:56.46	2025-06-09 12:18:56.46	\N	\N	\N
cmbpd6krg0000po1016qgyfwq	image	2025-06-09 17:26:52.06	2025-06-09 17:26:52.06	\N	\N	\N
cmbpd9phv0001po105g9tefyc	image	2025-06-09 17:29:18.163	2025-06-09 17:29:18.163	\N	\N	\N
cmbpddjnp0002po10q2k3uisl	image	2025-06-09 17:32:17.208	2025-06-09 17:32:17.208	\N	\N	\N
cmbpdjjng0003po105ecrm380	image	2025-06-09 17:36:57.148	2025-06-09 17:36:57.148	\N	\N	\N
cmc3r47r20001pb10io43olm1	image	2025-06-19 19:05:42.974	2025-06-19 19:05:42.974	\N	\N	\N
cmc3rn5lf0004pb100x2ajqij	image	2025-06-19 19:20:26.633	2025-06-19 19:20:26.633	\N	\N	\N
cmc3rr72l0006pb105qemo7kv	image	2025-06-19 19:23:35.181	2025-06-19 19:23:35.181	\N	\N	\N
cmc3rwm2y0008pb10ed88hlxc	image	2025-06-19 19:27:47.905	2025-06-19 19:27:47.905	\N	\N	\N
cmc3rwsj80009pb1043u0ncvn	image	2025-06-19 19:27:56.277	2025-06-19 19:27:56.277	\N	\N	\N
cmc3s8t42000gpb10vrrvq3uh	image	2025-06-19 19:37:16.888	2025-06-19 19:37:16.888	\N	\N	\N
cmc3ur153000kpb10tv83t3kz	image	2025-06-19 20:47:26.325	2025-06-19 20:47:26.325	\N	\N	\N
cmc3uxsec000opb104viqajzu	image	2025-06-19 20:52:41.551	2025-06-19 20:52:41.551	\N	\N	\N
cmc3vcq800000ny10ojz3ewbv	image	2025-06-19 21:04:18.624	2025-06-19 21:04:18.624	\N	\N	\N
cmc3vwacp000dny100bmcf0vr	image	2025-06-19 21:19:31.167	2025-06-19 21:19:31.167	\N	\N	\N
cmc3vzmh7000fny10cs27egfs	image	2025-06-19 21:22:06.859	2025-06-19 21:22:06.859	\N	\N	\N
cmc3w3hw7000hny10pmqt5lya	image	2025-06-19 21:25:07.533	2025-06-19 21:25:07.533	\N	\N	\N
cmc3w90uw000kny10h044o13e	image	2025-06-19 21:29:25.4	2025-06-19 21:29:25.4	\N	\N	\N
cmc3wgpwu000ony10lj8513r9	image	2025-06-19 21:35:24.451	2025-06-19 21:35:24.451	\N	\N	\N
cmc3wm2zg000qny10ad3cn7ay	image	2025-06-19 21:39:34.684	2025-06-19 21:39:34.684	\N	\N	\N
cmc3wsav8000sny10k8h2uxxa	image	2025-06-19 21:44:24.823	2025-06-19 21:44:24.823	\N	\N	\N
cmc3wyjf1000vny10r2aze4ph	image	2025-06-19 21:49:15.853	2025-06-19 21:49:15.853	\N	\N	\N
cmc3xkujg0011ny10rdw6187j	image	2025-06-19 22:06:36.632	2025-06-19 22:06:36.632	\N	\N	\N
cmc3xxzbn0018ny10d4k15yw9	image	2025-06-19 22:16:49.357	2025-06-19 22:16:49.357	\N	\N	\N
cmc4j4q4e0001ns10fpatf35p	image	2025-06-20 08:09:56.031	2025-06-20 08:09:56.031	\N	\N	\N
cmc4zpi8u0000nz10zqvfce0a	image	2025-06-20 15:53:59.454	2025-06-20 15:53:59.454	\N	\N	\N
cmc50med80002nz10nhbz8q2e	image	2025-06-20 16:19:34.067	2025-06-20 16:19:34.067	\N	\N	\N
cmc50movc0003nz107cg4ih8l	image	2025-06-20 16:19:47.688	2025-06-20 16:19:47.688	\N	\N	\N
cmc50mwig0004nz10htr2zjq8	image	2025-06-20 16:19:57.592	2025-06-20 16:19:57.592	\N	\N	\N
cmc510lco0009nz101ioxyf3p	image	2025-06-20 16:30:36.302	2025-06-20 16:30:36.302	\N	\N	\N
cmc51ksqr0000pm1022740tzp	image	2025-06-20 16:46:19.011	2025-06-20 16:46:19.011	\N	\N	\N
cmc79djjx0001rv10hjyf041c	image	2025-06-22 06:00:09.789	2025-06-22 06:00:09.789	\N	\N	\N
cmc79eue80004rv10f94ymhs9	image	2025-06-22 06:01:10.496	2025-06-22 06:01:10.496	\N	\N	\N
cmc79fx2g0007rv10vjfy6lbv	image	2025-06-22 06:02:00.617	2025-06-22 06:02:00.617	\N	\N	\N
cmc79h0i8000arv10om4n0gz5	image	2025-06-22 06:02:51.728	2025-06-22 06:02:51.728	\N	\N	\N
cmc79holg000drv105wr7lx5o	image	2025-06-22 06:03:22.948	2025-06-22 06:03:22.948	\N	\N	\N
cmc79ltn6000grv10lgm8bxkq	image	2025-06-22 06:06:36.103	2025-06-22 06:06:36.103	\N	\N	\N
cmc7d3hxq0000le10hg4khm09	image	2025-06-22 07:44:19.598	2025-06-22 07:44:19.598	\N	\N	\N
cmc7eo8on0000my10ngc15cxc	image	2025-06-22 08:28:26.999	2025-06-22 08:28:26.999	\N	\N	\N
cmcdc245n0000qk108zkzmtch	image	2025-06-26 12:01:52.524	2025-06-26 12:01:52.524	\N	\N	\N
cmcelp8zx0000n310bghmw0uc	image	2025-06-27 09:19:34.604	2025-06-27 09:19:34.604	\N	\N	\N
cmcelpmpj0001n310m66pi8wy	image	2025-06-27 09:19:52.372	2025-06-27 09:19:52.372	\N	\N	\N
cmcelwwmd0002n3108wk55uz4	image	2025-06-27 09:25:31.814	2025-06-27 09:25:31.814	\N	\N	\N
cmcew1eom0001qr10r0a9czmz	image	2025-06-27 14:08:58.006	2025-06-27 14:08:58.006	\N	\N	\N
cmcg1yqd60000mj10iivqf0k3	image	2025-06-28 09:42:37.05	2025-06-28 09:42:37.05	\N	\N	\N
cmck9oajb0000su1079lblquz	image	2025-07-01 08:29:31.607	2025-07-01 08:29:31.607	\N	\N	\N
cmck9rhjh0001su10gm5b9dv2	image	2025-07-01 08:32:00.653	2025-07-01 08:32:00.653	\N	\N	\N
cmck9walh0002su10vpguiu3z	image	2025-07-01 08:35:44.917	2025-07-01 08:35:44.917	\N	\N	\N
cmck9xzdi0003su10940wnzo5	image	2025-07-01 08:37:03.702	2025-07-01 08:37:03.702	\N	\N	\N
cmcka05610004su10ch9i3ts6	image	2025-07-01 08:38:44.521	2025-07-01 08:38:44.521	\N	\N	\N
cmckaa6bh0000ke0zeupre233	image	2025-07-01 08:46:32.574	2025-07-01 08:46:32.574	\N	\N	\N
cmckbnxiu0001ke0zvvsl3yt3	image	2025-07-01 09:25:13.974	2025-07-01 09:25:13.974	\N	\N	\N
cmckbsn9n0002ke0z9y02rmc4	image	2025-07-01 09:28:53.963	2025-07-01 09:28:53.963	\N	\N	\N
cmckbxnvz0003ke0zho0tq9dq	image	2025-07-01 09:32:48.047	2025-07-01 09:32:48.047	\N	\N	\N
cmckc18mu0004ke0zi9slk3gq	image	2025-07-01 09:35:34.903	2025-07-01 09:35:34.903	\N	\N	\N
cmckc5j5d0005ke0zgru7hkcq	image	2025-07-01 09:38:55.153	2025-07-01 09:38:55.153	\N	\N	\N
cmckc946d0006ke0zyqr2ztwf	image	2025-07-01 09:41:42.373	2025-07-01 09:41:42.373	\N	\N	\N
cmckcel8m0007ke0zbkxh1xpa	image	2025-07-01 09:45:57.753	2025-07-01 09:45:57.753	\N	\N	\N
cmckcjugw0008ke0z45k8g1ye	image	2025-07-01 09:50:03.008	2025-07-01 09:50:03.008	\N	\N	\N
cmckconip0009ke0z7f487ut5	image	2025-07-01 09:53:47.281	2025-07-01 09:53:47.281	\N	\N	\N
cmckct5n3000ake0z62aqsvi6	image	2025-07-01 09:57:17.374	2025-07-01 09:57:17.374	\N	\N	\N
cmckd2dwz000bke0zrvk2rc85	image	2025-07-01 10:04:28.02	2025-07-01 10:04:28.02	\N	\N	\N
cmckd9t8j000cke0zdwax5piu	image	2025-07-01 10:10:14.468	2025-07-01 10:10:14.468	\N	\N	\N
cmckddyfq000dke0zaz7yeb2b	image	2025-07-01 10:13:27.83	2025-07-01 10:13:27.83	\N	\N	\N
cmckdg1ek000eke0z8ht3layy	image	2025-07-01 10:15:04.989	2025-07-01 10:15:04.989	\N	\N	\N
cmckdgkf3000fke0z6vmvw2u3	image	2025-07-01 10:15:29.631	2025-07-01 10:15:29.631	\N	\N	\N
cmckdmbow000gke0ztjoafqlu	image	2025-07-01 10:19:58.256	2025-07-01 10:19:58.256	\N	\N	\N
cmckdp9dy000hke0zygqvq64y	image	2025-07-01 10:22:15.238	2025-07-01 10:22:15.238	\N	\N	\N
cmckdrgvp000ike0zy7or8jqi	image	2025-07-01 10:23:58.261	2025-07-01 10:23:58.261	\N	\N	\N
cmckdvr1v000jke0zeusastjc	image	2025-07-01 10:27:18.067	2025-07-01 10:27:18.067	\N	\N	\N
cmckdzo5o000kke0zuvwn8le7	image	2025-07-01 10:30:20.94	2025-07-01 10:30:20.94	\N	\N	\N
cmcke2s7z000lke0zg3lqujan	image	2025-07-01 10:32:46.175	2025-07-01 10:32:46.175	\N	\N	\N
cmckeek7g000mke0z9r3mtstd	image	2025-07-01 10:41:55.661	2025-07-01 10:41:55.661	\N	\N	\N
cmckejql6000nke0z5yxdecm4	image	2025-07-01 10:45:57.21	2025-07-01 10:45:57.21	\N	\N	\N
cmckemgyn000oke0z5ckpslme	image	2025-07-01 10:48:04.703	2025-07-01 10:48:04.703	\N	\N	\N
cmckepopd000pke0zjtnw8rl5	image	2025-07-01 10:50:34.69	2025-07-01 10:50:34.69	\N	\N	\N
cmckf1hwm000qke0zui97ar63	image	2025-07-01 10:59:45.766	2025-07-01 10:59:45.766	\N	\N	\N
cmckf4o7j000rke0zjgt0ylrr	image	2025-07-01 11:02:13.904	2025-07-01 11:02:13.904	\N	\N	\N
cmckr6r8i0000k4106zrcr9xp	image	2025-07-01 16:39:46.53	2025-07-01 16:39:46.53	\N	\N	\N
cmckrifg20001k4100nil0y27	image	2025-07-01 16:48:51.123	2025-07-01 16:48:51.123	\N	\N	\N
cmckrshb20002k410wghvssvc	image	2025-07-01 16:56:40.095	2025-07-01 16:56:40.095	\N	\N	\N
cmckrshew0003k410au11266p	image	2025-07-01 16:56:40.233	2025-07-01 16:56:40.233	\N	\N	\N
cmckrshhh0004k410un9stuqs	image	2025-07-01 16:56:40.325	2025-07-01 16:56:40.325	\N	\N	\N
cmckrshjt0005k4106f2koagn	image	2025-07-01 16:56:40.41	2025-07-01 16:56:40.41	\N	\N	\N
cmckrw4k00006k410mz6sydda	image	2025-07-01 16:59:30.192	2025-07-01 16:59:30.192	\N	\N	\N
cmcks7nhc0007k410cd5xq46e	image	2025-07-01 17:08:27.936	2025-07-01 17:08:27.936	\N	\N	\N
cmcksfzic0008k410nyf02hkm	image	2025-07-01 17:14:56.772	2025-07-01 17:14:56.772	\N	\N	\N
cmckuqufg0009k4109scoll9e	image	2025-07-01 18:19:22.637	2025-07-01 18:19:22.637	\N	\N	\N
cmckut6g0000ak410en39b23i	image	2025-07-01 18:21:11.52	2025-07-01 18:21:11.52	\N	\N	\N
cmckuvg3t000bk4104d8nhuqg	image	2025-07-01 18:22:57.353	2025-07-01 18:22:57.353	\N	\N	\N
cmckuxggp000ck41081h6is8d	image	2025-07-01 18:24:31.129	2025-07-01 18:24:31.129	\N	\N	\N
cmckv0b4n000dk410egpp5qx0	image	2025-07-01 18:26:44.183	2025-07-01 18:26:44.183	\N	\N	\N
cmckv3tzz000ek410oh23fa2d	image	2025-07-01 18:29:28.607	2025-07-01 18:29:28.607	\N	\N	\N
cmckv8907000fk410fv5e5cxa	image	2025-07-01 18:32:54.679	2025-07-01 18:32:54.679	\N	\N	\N
cmckvcvh5000gk410uh9g5y8k	image	2025-07-01 18:36:30.425	2025-07-01 18:36:30.425	\N	\N	\N
cmckvks22000hk410epk26s25	image	2025-07-01 18:42:39.242	2025-07-01 18:42:39.242	\N	\N	\N
cmckvnqnn000ik4102h4sgtzj	image	2025-07-01 18:44:57.395	2025-07-01 18:44:57.395	\N	\N	\N
cmckwbrzt0000pa102snc15vf	image	2025-07-01 19:03:38.871	2025-07-01 19:03:38.871	\N	\N	\N
cmckwmr9t0002pa10gt7znmu1	image	2025-07-01 19:12:11.142	2025-07-01 19:12:11.142	\N	\N	\N
cmckwtcj60004pa104yepm1eq	image	2025-07-01 19:17:18.642	2025-07-01 19:17:18.642	\N	\N	\N
cmcn4jnfr0000pb10rfik5lny	image	2025-07-03 08:29:15.495	2025-07-03 08:29:15.495	\N	\N	\N
cmcoo2oo50000t910fpqclqp6	image	2025-07-04 10:23:42.422	2025-07-04 10:23:42.422	\N	\N	\N
cmcoo2oro0001t910srlxsn9s	image	2025-07-04 10:23:42.564	2025-07-04 10:23:42.564	\N	\N	\N
cmcoo2oui0002t910u9vwxvju	image	2025-07-04 10:23:42.667	2025-07-04 10:23:42.667	\N	\N	\N
cmcoo2oyj0003t9107qjyjwz5	image	2025-07-04 10:23:42.812	2025-07-04 10:23:42.812	\N	\N	\N
cmcrezuux0001mi10l2nl4h0k	image	2025-07-06 08:32:52.473	2025-07-06 08:32:52.473	\N	\N	\N
cmcrf0hfd0002mi107zwtjt8i	image	2025-07-06 08:33:21.722	2025-07-06 08:33:21.722	\N	\N	\N
cmcrk4jfr0001pb0zcfsf6pve	image	2025-07-06 10:56:29.031	2025-07-06 10:56:29.031	\N	\N	\N
cmcrk4ji80002pb0z0o1hz7rk	image	2025-07-06 10:56:29.121	2025-07-06 10:56:29.121	\N	\N	\N
cmcrkt5450008pb0zp7x69s4p	image	2025-07-06 11:15:36.869	2025-07-06 11:15:36.869	\N	\N	\N
cmcrl3q4p000bpb0zu583ro6k	image	2025-07-06 11:23:50.665	2025-07-06 11:23:50.665	\N	\N	\N
cmcrl9r2g000dpb0zv55f57ar	image	2025-07-06 11:28:31.816	2025-07-06 11:28:31.816	\N	\N	\N
cmcrltkpr000fpb0z7avobxhg	image	2025-07-06 11:43:56.702	2025-07-06 11:43:56.702	\N	\N	\N
cmcrng31t000ipb0zzklh1glt	image	2025-07-06 12:29:26.514	2025-07-06 12:29:26.514	\N	\N	\N
cmcrnjqkj000jpb0zi6jghovj	image	2025-07-06 12:32:16.963	2025-07-06 12:32:16.963	\N	\N	\N
cmcrnp3c6000kpb0z3rv3hony	image	2025-07-06 12:36:26.789	2025-07-06 12:36:26.789	\N	\N	\N
cmcrnu6lv000lpb0z3oocez49	image	2025-07-06 12:40:24.296	2025-07-06 12:40:24.296	\N	\N	\N
cmcro09j0000mpb0zik1pmg2y	image	2025-07-06 12:45:08.028	2025-07-06 12:45:08.028	\N	\N	\N
cmcrolfsa000opb0zs73ujlnt	image	2025-07-06 13:01:35.915	2025-07-06 13:01:35.915	\N	\N	\N
cmcssqcxb0000of0z496a3nyr	image	2025-07-07 07:45:10.126	2025-07-07 07:45:10.126	\N	\N	\N
cmcssr3fm0001of0zgrz8y3xo	image	2025-07-07 07:45:44.482	2025-07-07 07:45:44.482	\N	\N	\N
cmcst95kx0002of0zkf4uddgp	image	2025-07-07 07:59:47.073	2025-07-07 07:59:47.073	\N	\N	\N
cmcst95nc0003of0z9bw2acda	image	2025-07-07 07:59:47.161	2025-07-07 07:59:47.161	\N	\N	\N
cmcstdpr00005of0zuwu7pbm0	image	2025-07-07 08:03:19.836	2025-07-07 08:03:19.836	\N	\N	\N
cmcstdpti0006of0znptc77cl	image	2025-07-07 08:03:19.927	2025-07-07 08:03:19.927	\N	\N	\N
cmcsth7fi0008of0z1u98cteb	image	2025-07-07 08:06:02.718	2025-07-07 08:06:02.718	\N	\N	\N
cmcsth9yi0009of0zp44n97mx	image	2025-07-07 08:06:05.994	2025-07-07 08:06:05.994	\N	\N	\N
cmcstha1q000aof0zv2bjtmk8	image	2025-07-07 08:06:06.11	2025-07-07 08:06:06.11	\N	\N	\N
cmcsthbk4000bof0zg6su42f0	image	2025-07-07 08:06:08.069	2025-07-07 08:06:08.069	\N	\N	\N
cmcsthf8w000cof0z75u5y9ch	image	2025-07-07 08:06:12.849	2025-07-07 08:06:12.849	\N	\N	\N
cmcsthibe000dof0zc2b1mmo8	image	2025-07-07 08:06:16.827	2025-07-07 08:06:16.827	\N	\N	\N
cmcsti6ko000eof0zj51x90k7	image	2025-07-07 08:06:48.264	2025-07-07 08:06:48.264	\N	\N	\N
cmcstibm2000fof0zjcjl9n7l	image	2025-07-07 08:06:54.795	2025-07-07 08:06:54.795	\N	\N	\N
cmcstihru000gof0zer2mh3ta	image	2025-07-07 08:07:02.779	2025-07-07 08:07:02.779	\N	\N	\N
cmcstla4l000iof0zo42wajt3	image	2025-07-07 08:09:12.837	2025-07-07 08:09:12.837	\N	\N	\N
cmcstla6y000jof0z4wolii5i	image	2025-07-07 08:09:12.923	2025-07-07 08:09:12.923	\N	\N	\N
cmcsto5bc000lof0zv6qimxol	image	2025-07-07 08:11:26.567	2025-07-07 08:11:26.567	\N	\N	\N
cmcsto5e6000mof0z7z53pp35	image	2025-07-07 08:11:26.67	2025-07-07 08:11:26.67	\N	\N	\N
cmcsunzek000pof0z73ttw24p	image	2025-07-07 08:39:18.524	2025-07-07 08:39:18.524	\N	\N	\N
cmcsunzhs000qof0zhgw61g9n	image	2025-07-07 08:39:18.641	2025-07-07 08:39:18.641	\N	\N	\N
cmcsuqrt7000sof0z6tr3j2uk	image	2025-07-07 08:41:28.651	2025-07-07 08:41:28.651	\N	\N	\N
cmcsuqrx9000tof0zx61s1vkc	image	2025-07-07 08:41:28.798	2025-07-07 08:41:28.798	\N	\N	\N
cmcsuz32k0001oa10svs6aar8	image	2025-07-07 08:47:56.492	2025-07-07 08:47:56.492	\N	\N	\N
cmcsuz3500002oa101vitgzti	image	2025-07-07 08:47:56.581	2025-07-07 08:47:56.581	\N	\N	\N
cmcsv2ybv0004oa10wyy4pbgh	image	2025-07-07 08:50:56.972	2025-07-07 08:50:56.972	\N	\N	\N
cmcsv2yf80005oa10fb1ps7ae	image	2025-07-07 08:50:57.092	2025-07-07 08:50:57.092	\N	\N	\N
cmcsv5jz50007oa10kv4u2bs3	image	2025-07-07 08:52:58.337	2025-07-07 08:52:58.337	\N	\N	\N
cmcsv5k300008oa10tg9emo2c	image	2025-07-07 08:52:58.477	2025-07-07 08:52:58.477	\N	\N	\N
cmcsv7dpc000boa10ffrqkc1e	image	2025-07-07 08:54:23.502	2025-07-07 08:54:23.502	\N	\N	\N
cmcsv7dsi000coa10g03geqax	image	2025-07-07 08:54:23.634	2025-07-07 08:54:23.634	\N	\N	\N
cmcsv9hog000eoa10skp9btj7	image	2025-07-07 08:56:01.984	2025-07-07 08:56:01.984	\N	\N	\N
cmcsv9hsi000foa10wp3dnda9	image	2025-07-07 08:56:02.13	2025-07-07 08:56:02.13	\N	\N	\N
cmcsvau9m000hoa10slooe82p	image	2025-07-07 08:57:04.954	2025-07-07 08:57:04.954	\N	\N	\N
cmcsvci0o000ioa10p7n413ue	image	2025-07-07 08:58:22.392	2025-07-07 08:58:22.392	\N	\N	\N
cmcsvci4n000joa10fakoxuln	image	2025-07-07 08:58:22.535	2025-07-07 08:58:22.535	\N	\N	\N
cmcsvec55000loa100j765r0v	image	2025-07-07 08:59:48.089	2025-07-07 08:59:48.089	\N	\N	\N
cmcsvec93000moa10fpggsjkq	image	2025-07-07 08:59:48.232	2025-07-07 08:59:48.232	\N	\N	\N
cmcsvg86i000ooa10zlqcp960	image	2025-07-07 09:01:16.266	2025-07-07 09:01:16.266	\N	\N	\N
cmcsvg89p000poa104rhydyjw	image	2025-07-07 09:01:16.381	2025-07-07 09:01:16.381	\N	\N	\N
cmcsvi1kg000roa102pkvr0py	image	2025-07-07 09:02:41.008	2025-07-07 09:02:41.008	\N	\N	\N
cmcsvi1o4000soa10rtch3c2x	image	2025-07-07 09:02:41.14	2025-07-07 09:02:41.14	\N	\N	\N
cmcsvlchq000uoa10g1emac65	image	2025-07-07 09:05:15.134	2025-07-07 09:05:15.134	\N	\N	\N
cmcsvlcll000voa10dxvxsmnj	image	2025-07-07 09:05:15.273	2025-07-07 09:05:15.273	\N	\N	\N
cmct2uzpa0000n90zzdcoau4q	image	2025-07-07 12:28:42.43	2025-07-07 12:28:42.43	\N	\N	\N
cmct2uzsn0001n90zmmucbmkq	image	2025-07-07 12:28:42.552	2025-07-07 12:28:42.552	\N	\N	\N
cmct2yb3w0003n90zy6v5dwjc	image	2025-07-07 12:31:17.18	2025-07-07 12:31:17.18	\N	\N	\N
cmct2yb710004n90zejfeibso	image	2025-07-07 12:31:17.294	2025-07-07 12:31:17.294	\N	\N	\N
cmct30lxj0006n90zx2r0wfe8	image	2025-07-07 12:33:04.52	2025-07-07 12:33:04.52	\N	\N	\N
cmct30m0i0007n90z672i3uqm	image	2025-07-07 12:33:04.627	2025-07-07 12:33:04.627	\N	\N	\N
cmct30m3j0008n90zjg7pnrbo	image	2025-07-07 12:33:04.736	2025-07-07 12:33:04.736	\N	\N	\N
cmct43hkf000an90zv79pxinx	image	2025-07-07 13:03:18.447	2025-07-07 13:03:18.447	\N	\N	\N
cmct46n4c000cn90zuxjj0q7k	image	2025-07-07 13:05:45.613	2025-07-07 13:05:45.613	\N	\N	\N
cmct46n7t000dn90zrdfvhiek	image	2025-07-07 13:05:45.737	2025-07-07 13:05:45.737	\N	\N	\N
cmct49r6d000fn90zzadecbce	image	2025-07-07 13:08:10.837	2025-07-07 13:08:10.837	\N	\N	\N
cmct49rak000gn90zqrpn88np	image	2025-07-07 13:08:10.988	2025-07-07 13:08:10.988	\N	\N	\N
cmct4cjli000in90zt9j14m52	image	2025-07-07 13:10:20.982	2025-07-07 13:10:20.982	\N	\N	\N
cmct4cjon000jn90zz0x7lnch	image	2025-07-07 13:10:21.096	2025-07-07 13:10:21.096	\N	\N	\N
cmct4jg5k0000mm0zacdc7ef0	image	2025-07-07 13:15:43.112	2025-07-07 13:15:43.112	\N	\N	\N
cmct4jg8s0001mm0zo6t04ixy	image	2025-07-07 13:15:43.228	2025-07-07 13:15:43.228	\N	\N	\N
cmct4ky8o0003mm0zd46kwuut	image	2025-07-07 13:16:53.209	2025-07-07 13:16:53.209	\N	\N	\N
cmct4kyb70004mm0zryr2q015	image	2025-07-07 13:16:53.3	2025-07-07 13:16:53.3	\N	\N	\N
cmct4mynj0006mm0zhsd83kx2	image	2025-07-07 13:18:27.055	2025-07-07 13:18:27.055	\N	\N	\N
cmct4nhgb0007mm0zf3xylip7	image	2025-07-07 13:18:51.419	2025-07-07 13:18:51.419	\N	\N	\N
cmct4nhk40008mm0zmjjq3pm3	image	2025-07-07 13:18:51.556	2025-07-07 13:18:51.556	\N	\N	\N
cmct4ot4o000amm0zr4p7xhdp	image	2025-07-07 13:19:53.208	2025-07-07 13:19:53.208	\N	\N	\N
cmct4vamm000bmm0zwybuft37	image	2025-07-07 13:24:55.823	2025-07-07 13:24:55.823	\N	\N	\N
cmct4vaq4000cmm0z4bkijq66	image	2025-07-07 13:24:55.949	2025-07-07 13:24:55.949	\N	\N	\N
cmcugwsxk0000p8101m2w3ch8	image	2025-07-08 11:49:47.768	2025-07-08 11:49:47.768	\N	\N	\N
cmcugzhmk0002p8106tzdfqay	image	2025-07-08 11:51:53.084	2025-07-08 11:51:53.084	\N	\N	\N
cmcugzhs30003p8107uxp4utt	image	2025-07-08 11:51:53.284	2025-07-08 11:51:53.284	\N	\N	\N
cmcuh19bc0005p8100hxstrqj	image	2025-07-08 11:53:15.624	2025-07-08 11:53:15.624	\N	\N	\N
cmcuh5xs90007p8101zfnu9t1	image	2025-07-08 11:56:53.961	2025-07-08 11:56:53.961	\N	\N	\N
cmcuh8vgj0009p810vzvg8ila	image	2025-07-08 11:59:10.916	2025-07-08 11:59:10.916	\N	\N	\N
cmcuhbppt000bp8103qexpp25	image	2025-07-08 12:01:23.442	2025-07-08 12:01:23.442	\N	\N	\N
cmcuhcdko000cp810hsv4suj1	image	2025-07-08 12:01:54.36	2025-07-08 12:01:54.36	\N	\N	\N
cmcuhedra000ep810w5z4s83e	image	2025-07-08 12:03:27.91	2025-07-08 12:03:27.91	\N	\N	\N
cmcuhedwh000fp810asg0yyba	image	2025-07-08 12:03:28.098	2025-07-08 12:03:28.098	\N	\N	\N
cmcuhg2dm000hp810qod9v6q3	image	2025-07-08 12:04:46.474	2025-07-08 12:04:46.474	\N	\N	\N
cmcuhi4ag000jp810pinxqn78	image	2025-07-08 12:06:22.265	2025-07-08 12:06:22.265	\N	\N	\N
cmcuhi4e5000kp810dajwgzxy	image	2025-07-08 12:06:22.397	2025-07-08 12:06:22.397	\N	\N	\N
cmcuhlcjq000mp81070vxn20e	image	2025-07-08 12:08:52.934	2025-07-08 12:08:52.934	\N	\N	\N
cmcuhlcnl000np8107azclkzm	image	2025-07-08 12:08:53.073	2025-07-08 12:08:53.073	\N	\N	\N
cmcuhnme4000pp810pz26hnrn	image	2025-07-08 12:10:39.005	2025-07-08 12:10:39.005	\N	\N	\N
cmcuhnmi1000qp810330nxafs	image	2025-07-08 12:10:39.146	2025-07-08 12:10:39.146	\N	\N	\N
cmcuhpjt7000sp810xp1fh8y7	image	2025-07-08 12:12:08.972	2025-07-08 12:12:08.972	\N	\N	\N
cmcuhpjzk000tp8107eg7whlg	image	2025-07-08 12:12:09.2	2025-07-08 12:12:09.2	\N	\N	\N
cmcvtlhti0005le10z9jcz6i3	image	2025-07-09 10:32:41.335	2025-07-09 10:32:41.335	\N	\N	\N
cmcvtlhx90006le10qzt90zea	image	2025-07-09 10:32:41.469	2025-07-09 10:32:41.469	\N	\N	\N
cmcvw3g7m0001qp10z3xwxfrt	image	2025-07-09 11:42:38.29	2025-07-09 11:42:38.29	\N	\N	\N
cmcvw8rbl0003qp10btq3670c	image	2025-07-09 11:46:45.969	2025-07-09 11:46:45.969	\N	\N	\N
cmcvwbeba0004qp10x0kx9iei	image	2025-07-09 11:48:49.078	2025-07-09 11:48:49.078	\N	\N	\N
cmcvwgt4z0007qp10b8lwd2wj	image	2025-07-09 11:53:01.571	2025-07-09 11:53:01.571	\N	\N	\N
cmcvwh57w0008qp10tgf728fo	image	2025-07-09 11:53:17.228	2025-07-09 11:53:17.228	\N	\N	\N
cmcvwzbhl0002tb0zjz3o01qy	image	2025-07-09 12:07:25.162	2025-07-09 12:07:25.162	\N	\N	\N
cmcvwzblq0003tb0zxe0zwun2	image	2025-07-09 12:07:25.311	2025-07-09 12:07:25.311	\N	\N	\N
cmcvwzboy0004tb0z2dedipsb	image	2025-07-09 12:07:25.427	2025-07-09 12:07:25.427	\N	\N	\N
cmcvwzbsg0005tb0zb9jkm6o8	image	2025-07-09 12:07:25.552	2025-07-09 12:07:25.552	\N	\N	\N
cmcw3g7tq0001mn10yuqhzz46	image	2025-07-09 15:08:31.263	2025-07-09 15:08:31.263	\N	\N	\N
cmcw3jiro0002mn10akxv3fug	image	2025-07-09 15:11:05.412	2025-07-09 15:11:05.412	\N	\N	\N
cmcw3o5k50004mn10oo690ifw	image	2025-07-09 15:14:41.573	2025-07-09 15:14:41.573	\N	\N	\N
cmcw3xf6z0000nr0ztgnjfyp3	image	2025-07-09 15:21:53.962	2025-07-09 15:21:53.962	\N	\N	\N
cmcw43hkq0003nr0zo8hwpc94	image	2025-07-09 15:26:36.986	2025-07-09 15:26:36.986	\N	\N	\N
cmcwzj7sm0000mp1034cg38gh	image	2025-07-10 06:06:38.901	2025-07-10 06:06:38.901	\N	\N	\N
cmcwzkxpp0001mp10pwuz3w48	image	2025-07-10 06:07:59.15	2025-07-10 06:07:59.15	\N	\N	\N
cmcwzmjko0002mp108wannsnf	image	2025-07-10 06:09:14.13	2025-07-10 06:09:14.13	\N	\N	\N
cmcwzryma0003mp10851y9m3k	image	2025-07-10 06:13:26.912	2025-07-10 06:13:26.912	\N	\N	\N
cmcwztojz0004mp10h9fmlhm2	image	2025-07-10 06:14:47.172	2025-07-10 06:14:47.172	\N	\N	\N
cmcx0ervk0006mp10q357x0pj	image	2025-07-10 06:31:11.264	2025-07-10 06:31:11.264	\N	\N	\N
cmcx3n91a0001pf0zqjxgombd	image	2025-07-10 08:01:45.598	2025-07-10 08:01:45.598	\N	\N	\N
cmcx3q3ts0003pf0z75rp8q4q	image	2025-07-10 08:03:58.816	2025-07-10 08:03:58.816	\N	\N	\N
cmcx3sufd0004pf0zpq75vkva	image	2025-07-10 08:06:06.602	2025-07-10 08:06:06.602	\N	\N	\N
cmcx41ogd0009pf0zuozt2109	image	2025-07-10 08:12:58.765	2025-07-10 08:12:58.765	\N	\N	\N
cmcx44ipv000bpf0zzxy8xhro	image	2025-07-10 08:15:11.3	2025-07-10 08:15:11.3	\N	\N	\N
cmcx4bn23000epf0zmba5s9us	image	2025-07-10 08:20:43.516	2025-07-10 08:20:43.516	\N	\N	\N
cmcx4evj8000gpf0zfu4hzvql	image	2025-07-10 08:23:14.468	2025-07-10 08:23:14.468	\N	\N	\N
cmcx4jhck000ipf0zi1zxjyl9	image	2025-07-10 08:26:49.363	2025-07-10 08:26:49.363	\N	\N	\N
cmcxbom7f0000p110jt1jypqj	image	2025-07-10 11:46:46.25	2025-07-10 11:46:46.25	\N	\N	\N
cmcxbrym50002p110y1br48fu	image	2025-07-10 11:49:22.301	2025-07-10 11:49:22.301	\N	\N	\N
cmcyk4qp10000mk107g0rbsl6	image	2025-07-11 08:31:01.667	2025-07-11 08:31:01.667	\N	\N	\N
cmcykec8v0002mk10fu0b64ha	image	2025-07-11 08:38:29.503	2025-07-11 08:38:29.503	\N	\N	\N
cmcykfwvk0004mk10nsadulnc	image	2025-07-11 08:39:42.896	2025-07-11 08:39:42.896	\N	\N	\N
cmcykiv9x0006mk10fyqmus3o	image	2025-07-11 08:42:00.789	2025-07-11 08:42:00.789	\N	\N	\N
cmcys2peh0000mo0zn1bn0d3l	image	2025-07-11 12:13:23.609	2025-07-11 12:13:23.609	\N	\N	\N
cmcys4etj0002mo0zawom4xca	image	2025-07-11 12:14:43.207	2025-07-11 12:14:43.207	\N	\N	\N
cmcys65zh0004mo0zzj2ybgei	image	2025-07-11 12:16:05.07	2025-07-11 12:16:05.07	\N	\N	\N
cmd4a5fm80003te0zyuh80xgl	image	2025-07-15 08:38:14.864	2025-07-15 08:38:14.864	\N	\N	\N
cmd4aflur0000qj0zrlolgolu	image	2025-07-15 08:46:09.506	2025-07-15 08:46:09.506	\N	\N	\N
cmd4amedk0003qj0zl5gn929q	image	2025-07-15 08:51:26.408	2025-07-15 08:51:26.408	\N	\N	\N
cmd4aoo3l0004qj0zwzm35en3	image	2025-07-15 08:53:12.321	2025-07-15 08:53:12.321	\N	\N	\N
cmd4autkh0007qj0z8mcr0ov2	image	2025-07-15 08:57:59.345	2025-07-15 08:57:59.345	\N	\N	\N
cmd4bcxp8000bqj0zo7wxtbjn	image	2025-07-15 09:12:04.508	2025-07-15 09:12:04.508	\N	\N	\N
cmd4bcxsm000cqj0zkbzo2z73	image	2025-07-15 09:12:04.631	2025-07-15 09:12:04.631	\N	\N	\N
cmd4bcxv3000dqj0zf1lwjtty	image	2025-07-15 09:12:04.72	2025-07-15 09:12:04.72	\N	\N	\N
cmd4bo3o9000iqj0zrkani48x	image	2025-07-15 09:20:45.465	2025-07-15 09:20:45.465	\N	\N	\N
cmd4brdyy000kqj0z8qwe6ek6	image	2025-07-15 09:23:18.778	2025-07-15 09:23:18.778	\N	\N	\N
cmd4bvl4x000mqj0zg50nlp32	image	2025-07-15 09:26:34.675	2025-07-15 09:26:34.675	\N	\N	\N
cmd8k2z500000l510yb9e6glm	image	2025-07-18 08:27:21.06	2025-07-18 08:27:21.06	\N	\N	\N
cmd8k2z8w0001l510dyvk9bkq	image	2025-07-18 08:27:21.201	2025-07-18 08:27:21.201	\N	\N	\N
cmd8lf4cp0001nv1037t12mq7	image	2025-07-18 09:04:47.305	2025-07-18 09:04:47.305	\N	\N	\N
cmd8mbe2o0001p80z9juy9wa5	image	2025-07-18 09:29:52.896	2025-07-18 09:29:52.896	\N	\N	\N
cmd8mju820002p80zhsh33174	image	2025-07-18 09:36:27.074	2025-07-18 09:36:27.074	\N	\N	\N
cmd8pe7m00000mz0zj790p342	image	2025-07-18 10:56:03.335	2025-07-18 10:56:03.335	\N	\N	\N
cmd8pg68b0002mz0zong4r3zd	image	2025-07-18 10:57:34.859	2025-07-18 10:57:34.859	\N	\N	\N
cmd8pisnb0004mz0zaaxyli4t	image	2025-07-18 10:59:37.223	2025-07-18 10:59:37.223	\N	\N	\N
cmd8pm40n0006mz0zksq0kptv	image	2025-07-18 11:02:11.927	2025-07-18 11:02:11.927	\N	\N	\N
cmd8pnscz0008mz0zl5dq2ol2	image	2025-07-18 11:03:30.132	2025-07-18 11:03:30.132	\N	\N	\N
cmd8ppykl000amz0zwd81bnsr	image	2025-07-18 11:05:11.493	2025-07-18 11:05:11.493	\N	\N	\N
cmd8prn8h000cmz0zbl77zssg	image	2025-07-18 11:06:30.114	2025-07-18 11:06:30.114	\N	\N	\N
cmd8pt5tx000emz0zuciytp4t	image	2025-07-18 11:07:40.87	2025-07-18 11:07:40.87	\N	\N	\N
cmd8pv7jk000gmz0zbgowrz6m	image	2025-07-18 11:09:16.4	2025-07-18 11:09:16.4	\N	\N	\N
cmd8px0or000imz0zgc9xdw32	image	2025-07-18 11:10:40.828	2025-07-18 11:10:40.828	\N	\N	\N
cmd8pyju8000kmz0zus37y71t	image	2025-07-18 11:11:52.305	2025-07-18 11:11:52.305	\N	\N	\N
cmd8q0a0i000mmz0zfbxctcbc	image	2025-07-18 11:13:12.882	2025-07-18 11:13:12.882	\N	\N	\N
cmd8q1vxh000omz0z854fdbv8	image	2025-07-18 11:14:27.941	2025-07-18 11:14:27.941	\N	\N	\N
cmd8q3bfo000qmz0zdx14jxso	image	2025-07-18 11:15:34.683	2025-07-18 11:15:34.683	\N	\N	\N
cmd8q5b96000smz0zt5hzquzg	image	2025-07-18 11:17:07.77	2025-07-18 11:17:07.77	\N	\N	\N
cmd8zwn7v0000tg10yc94x1yf	image	2025-07-18 15:50:19.531	2025-07-18 15:50:19.531	\N	\N	\N
cmd8zwnbm0001tg10rmwg9pho	image	2025-07-18 15:50:19.666	2025-07-18 15:50:19.666	\N	\N	\N
cmd906m9e0006tg10c8qhnz7d	image	2025-07-18 15:58:04.85	2025-07-18 15:58:04.85	\N	\N	\N
cmd906mcy0007tg10755g0qih	image	2025-07-18 15:58:04.978	2025-07-18 15:58:04.978	\N	\N	\N
cmdbm9yav0000nw0z9ymydpve	image	2025-07-20 11:52:04.327	2025-07-20 11:52:04.327	\N	\N	\N
cmdbmve5e0000o60z9c6ng849	image	2025-07-20 12:08:44.642	2025-07-20 12:08:44.642	\N	\N	\N
cmdc9g0tm0000qs0z4zi66sn3	image	2025-07-20 22:40:38.698	2025-07-20 22:40:38.698	\N	\N	\N
cmdc9g0yw0001qs0zat0khls3	image	2025-07-20 22:40:38.888	2025-07-20 22:40:38.888	\N	\N	\N
cmdc9g15k0002qs0za7fqu0pa	image	2025-07-20 22:40:39.129	2025-07-20 22:40:39.129	\N	\N	\N
cmdc9g1bs0003qs0z82s9jbhv	image	2025-07-20 22:40:39.352	2025-07-20 22:40:39.352	\N	\N	\N
cmdc9g1ij0004qs0zv43be3vu	image	2025-07-20 22:40:39.596	2025-07-20 22:40:39.596	\N	\N	\N
cmdc9g1oi0005qs0zptw2isxc	image	2025-07-20 22:40:39.811	2025-07-20 22:40:39.811	\N	\N	\N
cmdc9g1st0006qs0z2tesmcdc	image	2025-07-20 22:40:39.965	2025-07-20 22:40:39.965	\N	\N	\N
cmdc9g1xa0007qs0z5rjg9pzs	image	2025-07-20 22:40:40.126	2025-07-20 22:40:40.126	\N	\N	\N
cmdc9otes0008qs0zjdvowtxv	image	2025-07-20 22:47:28.997	2025-07-20 22:47:28.997	\N	\N	\N
cmdc9otlc0009qs0zrvc3pxwx	image	2025-07-20 22:47:29.233	2025-07-20 22:47:29.233	\N	\N	\N
cmdc9otr0000aqs0zb1bh11n3	image	2025-07-20 22:47:29.436	2025-07-20 22:47:29.436	\N	\N	\N
cmdc9otxc000bqs0znl0oboeh	image	2025-07-20 22:47:29.664	2025-07-20 22:47:29.664	\N	\N	\N
cmdc9ou3n000cqs0zp2s97p3a	image	2025-07-20 22:47:29.891	2025-07-20 22:47:29.891	\N	\N	\N
cmdctmp7o0002pc0zidb0nmol	image	2025-07-21 08:05:42.565	2025-07-21 08:05:42.565	\N	\N	\N
cmdctmpd80003pc0zecnmmdzj	image	2025-07-21 08:05:42.765	2025-07-21 08:05:42.765	\N	\N	\N
cmdctmpfm0004pc0zjfhb97ky	image	2025-07-21 08:05:42.85	2025-07-21 08:05:42.85	\N	\N	\N
cmdctmpi20005pc0z0iah74sp	image	2025-07-21 08:05:42.938	2025-07-21 08:05:42.938	\N	\N	\N
cmdcw0e8i0001ry10v8s7uj6k	image	2025-07-21 09:12:20.755	2025-07-21 09:12:20.755	\N	\N	\N
cmdcwqy9n0003ry10dtum7ca8	image	2025-07-21 09:32:59.772	2025-07-21 09:32:59.772	\N	\N	\N
cmdcx99iy0005ry10juv4rt5z	image	2025-07-21 09:47:14.17	2025-07-21 09:47:14.17	\N	\N	\N
cmdcx99ng0006ry10vx0eapf0	image	2025-07-21 09:47:14.332	2025-07-21 09:47:14.332	\N	\N	\N
cmdcx99sz0007ry10tft4ycv7	image	2025-07-21 09:47:14.531	2025-07-21 09:47:14.531	\N	\N	\N
cmdcx99yd0008ry10s4pu41bx	image	2025-07-21 09:47:14.726	2025-07-21 09:47:14.726	\N	\N	\N
cmdcx9a3d0009ry10xmkuci1b	image	2025-07-21 09:47:14.905	2025-07-21 09:47:14.905	\N	\N	\N
cmdd2y3950002pd0zf37i1rex	image	2025-07-21 12:26:30.522	2025-07-21 12:26:30.522	\N	\N	\N
cmdd3024e0003pd0z88pmes04	image	2025-07-21 12:28:02.366	2025-07-21 12:28:02.366	\N	\N	\N
cmdd33efo0005pd0zawz8xnp7	image	2025-07-21 12:30:38.292	2025-07-21 12:30:38.292	\N	\N	\N
cmdd33eqg0006pd0ziw1kdsgm	image	2025-07-21 12:30:38.681	2025-07-21 12:30:38.681	\N	\N	\N
cmdd371yx0008pd0zaitupuy3	image	2025-07-21 12:33:28.761	2025-07-21 12:33:28.761	\N	\N	\N
cmdd3726r0009pd0z73dfvjsn	image	2025-07-21 12:33:29.043	2025-07-21 12:33:29.043	\N	\N	\N
cmdd372bn000apd0zexs5inqc	image	2025-07-21 12:33:29.219	2025-07-21 12:33:29.219	\N	\N	\N
cmdd372h8000bpd0z4ygx7zmo	image	2025-07-21 12:33:29.42	2025-07-21 12:33:29.42	\N	\N	\N
cmdd3z6k40001qo0zozzn2em0	image	2025-07-21 12:55:21.076	2025-07-21 12:55:21.076	\N	\N	\N
cmdd3z6ps0002qo0zqfhq801d	image	2025-07-21 12:55:21.281	2025-07-21 12:55:21.281	\N	\N	\N
cmdd3z6w20003qo0zb4xmpozk	image	2025-07-21 12:55:21.506	2025-07-21 12:55:21.506	\N	\N	\N
cmdd3z71t0004qo0zxqz0aqmv	image	2025-07-21 12:55:21.713	2025-07-21 12:55:21.713	\N	\N	\N
cmdd439qx0006qo0zy9jccowr	image	2025-07-21 12:58:31.833	2025-07-21 12:58:31.833	\N	\N	\N
cmdd439x10007qo0ztu6ec0l0	image	2025-07-21 12:58:32.054	2025-07-21 12:58:32.054	\N	\N	\N
cmdd43a360008qo0z3kxc6rgq	image	2025-07-21 12:58:32.275	2025-07-21 12:58:32.275	\N	\N	\N
cmdd43a980009qo0zwm4212c8	image	2025-07-21 12:58:32.493	2025-07-21 12:58:32.493	\N	\N	\N
cmdd43aff000aqo0zv44pkh6d	image	2025-07-21 12:58:32.715	2025-07-21 12:58:32.715	\N	\N	\N
cmdd47c3n000cqo0zfpuujhnj	image	2025-07-21 13:01:41.508	2025-07-21 13:01:41.508	\N	\N	\N
cmdd47cde000dqo0zm3wa2ctx	image	2025-07-21 13:01:41.858	2025-07-21 13:01:41.858	\N	\N	\N
cmdd47ck6000eqo0zyirws4hd	image	2025-07-21 13:01:42.103	2025-07-21 13:01:42.103	\N	\N	\N
cmdd47cqf000fqo0zynezkqqy	image	2025-07-21 13:01:42.328	2025-07-21 13:01:42.328	\N	\N	\N
cmdd47cw3000gqo0zwvb63rcj	image	2025-07-21 13:01:42.531	2025-07-21 13:01:42.531	\N	\N	\N
cmdd4anr1000iqo0zt33ewbtj	image	2025-07-21 13:04:16.574	2025-07-21 13:04:16.574	\N	\N	\N
cmdd4anxi000jqo0zkb3y11yl	image	2025-07-21 13:04:16.806	2025-07-21 13:04:16.806	\N	\N	\N
cmdd4ao2u000kqo0za13qa4kh	image	2025-07-21 13:04:16.999	2025-07-21 13:04:16.999	\N	\N	\N
cmdd4aobq000lqo0zmy77vr7y	image	2025-07-21 13:04:17.319	2025-07-21 13:04:17.319	\N	\N	\N
cmdd4aoia000mqo0zd0f36l5s	image	2025-07-21 13:04:17.555	2025-07-21 13:04:17.555	\N	\N	\N
cmdd4es8q000oqo0z3f6rv8l3	image	2025-07-21 13:07:29.018	2025-07-21 13:07:29.018	\N	\N	\N
cmdd4esfp000pqo0zk4dejezb	image	2025-07-21 13:07:29.27	2025-07-21 13:07:29.27	\N	\N	\N
cmdd4esnp000qqo0zexffm451	image	2025-07-21 13:07:29.557	2025-07-21 13:07:29.557	\N	\N	\N
cmdd4esui000rqo0za3fjgdfr	image	2025-07-21 13:07:29.803	2025-07-21 13:07:29.803	\N	\N	\N
cmdd4i5zz000tqo0zquk4y0z1	image	2025-07-21 13:10:06.816	2025-07-21 13:10:06.816	\N	\N	\N
cmdd4i65m000uqo0z934rspb3	image	2025-07-21 13:10:07.019	2025-07-21 13:10:07.019	\N	\N	\N
cmdd4i6ct000vqo0zcn1kwelg	image	2025-07-21 13:10:07.277	2025-07-21 13:10:07.277	\N	\N	\N
cmdd4i6jb000wqo0zwck0dyxd	image	2025-07-21 13:10:07.511	2025-07-21 13:10:07.511	\N	\N	\N
cmdd4oo5z000yqo0zxabj009o	image	2025-07-21 13:15:10.295	2025-07-21 13:15:10.295	\N	\N	\N
cmdd4oobe000zqo0zqrw82b3w	image	2025-07-21 13:15:10.491	2025-07-21 13:15:10.491	\N	\N	\N
cmdd4ooh00010qo0zwjc6ln6j	image	2025-07-21 13:15:10.693	2025-07-21 13:15:10.693	\N	\N	\N
cmdd4oomj0011qo0zg1go2cce	image	2025-07-21 13:15:10.891	2025-07-21 13:15:10.891	\N	\N	\N
cmdd4oosa0012qo0z31n63f0b	image	2025-07-21 13:15:11.098	2025-07-21 13:15:11.098	\N	\N	\N
cmdd4tpdw0014qo0zdyf1hyu2	image	2025-07-21 13:19:05.156	2025-07-21 13:19:05.156	\N	\N	\N
cmdd4tpjt0015qo0zspqsuf5i	image	2025-07-21 13:19:05.369	2025-07-21 13:19:05.369	\N	\N	\N
cmdd4tppo0016qo0zzy5ddg6y	image	2025-07-21 13:19:05.58	2025-07-21 13:19:05.58	\N	\N	\N
cmdd5e3m70017qo0zw8yftvck	image	2025-07-21 13:34:56.713	2025-07-21 13:34:56.713	\N	\N	\N
cmdecevca0001t40zb67ezasg	image	2025-07-22 09:39:16.139	2025-07-22 09:39:16.139	\N	\N	\N
cmdecevhq0002t40zwz0wal14	image	2025-07-22 09:39:16.334	2025-07-22 09:39:16.334	\N	\N	\N
cmdecevmw0003t40zuri6fj1p	image	2025-07-22 09:39:16.52	2025-07-22 09:39:16.52	\N	\N	\N
cmdecevus0004t40zpezyy2va	image	2025-07-22 09:39:16.804	2025-07-22 09:39:16.804	\N	\N	\N
cmdecew1a0005t40zyagdghfy	image	2025-07-22 09:39:17.039	2025-07-22 09:39:17.039	\N	\N	\N
cmdn9r4s90000rn0z7fpvfstb	image	2025-07-28 15:34:44.985	2025-07-28 15:34:44.985	\N	\N	\N
cmdn9w6nz0002rn0zaura9fow	image	2025-07-28 15:38:40.694	2025-07-28 15:38:40.694	\N	\N	\N
cmdn9z2g90004rn0zgqdl6v38	image	2025-07-28 15:40:55.209	2025-07-28 15:40:55.209	\N	\N	\N
cmdna1c880006rn0zyeyy7niu	image	2025-07-28 15:42:41.192	2025-07-28 15:42:41.192	\N	\N	\N
cmdna39dx0008rn0zjv21k4l9	image	2025-07-28 15:44:10.822	2025-07-28 15:44:10.822	\N	\N	\N
cmdna5230000arn0zn7lemapy	image	2025-07-28 15:45:34.668	2025-07-28 15:45:34.668	\N	\N	\N
cmev9ogl60000qp0z79ijsm8g	image	2025-08-28 10:34:32.058	2025-08-28 10:34:32.058	\N	\N	\N
\.


--
-- Data for Name: MediaFile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MediaFile" (id, url, format, width, height, size, quality, "mediaId") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "userId", total, subtotal, "shippingCost", "shippingName", "shippingPhone", "shippingAddress", "shippingCity", "deliveryMethod", "paymentMethod", "createdAt", "updatedAt", "addressId", "shippingDistrict", "shippingPostalCode", status, "deliveryDate", "invoiceId") FROM stdin;
cmg844lao0001ow0z9k1m263y	cmemlxa9m0002p80z9aigtoa2	14668.9	14649	19.9	deneme	0543 644 23 58	denemem	adana	standard	transfer	2025-10-01 14:59:49.583	2025-10-01 14:59:49.583	\N			PENDING	\N	\N
cmg84hjud000dow0zl5alyn6b	cmemlxa9m0002p80z9aigtoa2	1288.9	1249	39.9	mmmm	05436442357	uuuuuuuhhhh	ankara	express	transfer	2025-10-01 15:09:54.229	2025-10-01 15:09:54.229	\N			PENDING	\N	\N
cmgc011a30001rq0z8bl5rycu	cmemlxa9m0002p80z9aigtoa2	1268.9	1249	19.9	onur taş	05435442356	deneme1313	konya	standard	transfer	2025-10-04 08:16:09.914	2025-10-04 08:16:09.914	\N			PENDING	\N	\N
cmgc21veb0005qv0zy2jqc5u3	cmemlxa9m0002p80z9aigtoa2	1319.9	1300	19.9	siarişs	05436542356	dnenejnjnwedw	konya	same-day	transfer	2025-10-04 09:12:48.179	2025-10-04 09:12:48.179	\N			PENDING	\N	\N
cmgc26qvw000qqv0zgtx2lotr	cmgc25oib000gqv0zbucxfmhr	1319.9	1300	19.9	denememe	05436552348	deoewıwfen	adana	same-day	transfer	2025-10-04 09:16:35.613	2025-10-04 09:16:35.613	\N			PENDING	\N	\N
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, price, "productName", "productImage", "createdAt") FROM stdin;
cmg844lao0003ow0zygmd7j93	cmg844lao0001ow0z9k1m263y	cmd4bnt4u000hqj0zmtifxckr	1	850	Downtown Express Car Wash 	\N	2025-10-01 14:59:49.583
cmg844lao0004ow0zezv3tppa	cmg844lao0001ow0z9k1m263y	cmcrkg8zi0006pb0z32v9i068	1	1799	Fisher Price Uyku ve Oyun Arkadaşı Su Samuru	\N	2025-10-01 14:59:49.583
cmg844lao0005ow0z1qcrs88q	cmg844lao0001ow0z9k1m263y	cmdbmbs6l0003nw0z6kh2jmlr	3	4000	Star Wars The Child Animatronic Baby Yoda F1119	\N	2025-10-01 14:59:49.583
cmg84hjud000fow0zr5zghmju	cmg84hjud000dow0zl5alyn6b	cmcrksxem0007pb0zbtaeyw0f	1	1249	Fisher Price Eğlen ve Öğren Müzik Kutusu Türkçe Konuşan Aktivite Oyuncağı	\N	2025-10-01 15:09:54.229
cmgc011a30003rq0zb1f0xxkn	cmgc011a30001rq0z8bl5rycu	cmcrksxem0007pb0zbtaeyw0f	1	1249	Fisher Price Eğlen ve Öğren Müzik Kutusu Türkçe Konuşan Aktivite Oyuncağı	\N	2025-10-04 08:16:09.914
cmgc21veb0007qv0z6hfes2ew	cmgc21veb0005qv0zy2jqc5u3	cmc34bwuh0000pj10yz4xywma	1	1300	Süper Doktor	\N	2025-10-04 09:12:48.179
cmgc26qvx000sqv0z9ik9qf6p	cmgc26qvw000qqv0zgtx2lotr	cmcvwikgf0009qp10qjb5hm91	1	1300	Yeşil	\N	2025-10-04 09:16:35.613
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, slug, name, price, "createdAt", "updatedAt", discount, "groupId", "isActive", serial, sku, stock, description, views, barcode) FROM stdin;
cmcsuwer10000oa100152s4jt	barbie-dream-besties-paten-partisi-renee-bebek-ve-aksesuarlar-jfx99	Barbie Dream Besties Paten Partisi Renee Bebek ve Aksesuarlar	1499	2025-07-07 08:45:51.661	2025-07-09 09:35:42.008	0	\N	t	JFX99	\N	1	<p></p>	1	\N
cmcn6mwu50001p0108983lzs4	saat	Uzaktan Kumandalı İnteraktif Şarjlı Akıllı Kedi	1400	2025-07-03 09:27:46.877	2025-07-06 12:40:34.489	1200	\N	t	Qwk	\N	10	<p></p>	0	\N
cmbldoc930001nr10wgdz0rxf	fisher-price-sevimli-dj-hjp89	Fisher Price Sevimli DJ HJP89	12	2025-06-06 22:29:36.134	2025-07-07 07:32:20.031	\N	cmbewfo1l0000qh10p5k9x8rl	t	ewew	\N	12	<p></p>	0	\N
cmbak9l5q000fnv10w0r3bzlx	lolipop-ekilli-4-katl-makyaj-gzellik-seti	Lolipop Şekilli 4 Katlı Makyaj Güzellik Seti	600	2025-05-30 08:48:37.214	2025-09-14 12:47:35.469	\N	\N	t	\N	\N	\N		4	\N
cmcrk925y0005pb0zxfdt4aeq	dksnn-dnsnne	Dikey Elektrik Süpürgesi 3in 1 Pembe	1200	2025-07-06 10:59:59.927	2025-07-06 12:49:13.893	\N	\N	t	8694359085782	\N	10	<p></p>	3	\N
cmbbxql7s0006mo109di21792	fisher-price-eitici-kpekik-yrte-trke-ftg10	Fisher Price Eğitici Köpekçik Yürüteç Türkçe FTG10	174.99	2025-05-31 07:53:31.624	2025-07-10 05:15:15.46	\N	\N	t	\N	\N	\N	<p>Fisher Price Eğitici Köpekçik Yürüteç Türkçe FTG10</p>	1	\N
cmbew58zw0000ur104gisni7d	fisher-price-sesli-ve-ikl-eitici-vin-hwy62	Fisher Price Sesli ve Işıklı Eğitici Vinç HWY62	2000	2025-06-02 09:32:14.924	2025-07-20 10:54:25.352	\N	\N	t	HWY62	\N	12	<p></p>	2	\N
cmbox215t0000l910tg71wryy	cry-babies-loving-care-stitch-kostml-bebek-cyb70000	Cry Babies Loving Care Stitch Kostümlü Bebek CYB70000	12	2025-06-09 09:55:26.177	2025-07-07 07:30:08.529	\N	\N	t	1202010	\N	120120	<p></p>	2	\N
cmbal55jt0000o210os8x9zhw	fisher-price-kpekik-ve-arkadalar-oyun-konsolu-hnl54	Fisher Price Köpekçik ve Arkadaşları Oyun Konsolu HNL54	1000	2025-05-30 09:13:09.977	2025-07-16 08:45:04.086	\N	\N	t	\N	\N	0	<p></p>	4	\N
cmbiwc0xa0001mn104nfkyy7x	baby-clementoni-sevimli-unicorn-ngrak	Baby Clementoni Sevimli Unicorn Çıngırak	12	2025-06-05 04:48:35.759	2025-07-07 07:24:20.684	\N	\N	t	3223	\N	2332		1	\N
cmbex1o640000pn104lwwsblm	fisher-price-elen-ve-ren-sesli-kahve-keyfi-hwy44	Fisher Price Eğlen ve Öğren Sesli Kahve Keyfi HWY44	800	2025-06-02 09:57:27.579	2025-08-23 15:08:09.219	\N	\N	t	120321	\N	120	<p></p>	1	\N
cmbf2fute0002jz10xhxagav4	vardem-116-srtmeli-sesli-ikl-ambulans	Vardem 1:16 Sürtmeli Sesli Işıklı Ambulans	675	2025-06-02 12:28:27.458	2025-08-30 05:41:05.263	\N	cmbewfo1l0000qh10p5k9x8rl	t	1211	\N	120		6	\N
cmcstafc70004of0zkf7xzx45	barbie-taki-seti-tekli-kutu-1751875246374	Barbie Takı Seti Tekli Kutu	519	2025-07-07 08:00:46.376	2025-07-07 08:02:12.674	0	\N	t	\N	\N	1	<p></p>	1	\N
cmcstf1ee0007of0zg5ny8t2s	frozen-taki-tasarim-seti-tekli-kutu-1751875461589	Frozen Takı Tasarım Seti Tekli Kutu	519	2025-07-07 08:04:21.591	2025-07-07 08:04:21.591	0	\N	t	\N	\N	1	<p></p>	0	\N
cmbldbot00000nr10pom6r63f	niloya-mzikli-pelu-35-cm	Niloya Müzikli Peluş 35 cm	1200	2025-06-06 22:19:45.875	2025-07-10 08:36:00.295	\N	\N	t	denem	\N	12	<p></p>	0	\N
cmbweaqbw0001mt10gb7v0y17	hot-wheels-ejderhayla-mcadele-pisti-hdp03	Hot Wheels Ejderhayla Mücadele Pisti HDP03	2400	2025-06-14 15:32:28.748	2025-09-13 08:19:47.063	\N	\N	t	deoo12o	\N	120	<p>dassda</p>	3	\N
cmblzp9qm0000pv101d31wh33	fisher-price-sesli-ve-ikl-elenceli-kulaklklar-hwy47	Fisher Price Sesli ve Işıklı Eğlenceli Kulaklıklar HWY47	650	2025-06-07 08:46:11.084	2025-07-10 05:16:47.767	\N	\N	t	dsdas	\N	150	<p></p>	0	\N
cmcll84se0002p910vh60dib4	spiderman-titan-hero-30cm-figr	Spiderman Titan Hero 30cm. Figür	700	2025-07-02 06:40:39.231	2025-08-24 22:01:03.424	650	\N	t	E8522	\N	12	<p></p>	5	\N
cmbiwbdoj0000mn10sr7egyn3	116-srtmeli-sesli-ikl-ambulans-arabas	1:16 Sürtmeli Sesli Işıklı Ambulans Arabası	675	2025-06-05 04:48:05.635	2025-07-16 08:09:54.038	\N	\N	t	1221	\N	2121		2	\N
cmbndqfpt0000lh10zo0atu85	hot-wheels-city-mega-araba-ykama-hdp05	Hot Wheels City Mega Araba Yıkama HDP05	3000	2025-06-08 08:06:46.289	2025-07-22 20:09:32.57	\N	\N	t	12*	\N	210210012	<p></p>	3	\N
cmbby2vzs0000qd10phrrthrt	kumandal-araba	Gri	750	2025-05-31 08:03:05.46	2025-07-20 10:54:54.28	\N	cmd8zyaqd0002tg108zmo625c	t	\N	\N	0	<p></p>	11	\N
cmbndzi5e0000mo10vx8nj8uw	hot-wheels-city-hzl-pist-tr-hyt83	Hot Wheels City Hızlı Pist Tırı HYT83	900	2025-06-08 08:13:49.345	2025-07-22 20:09:36.144	\N	\N	t	deen133k1	\N	120210120	<p>dsckfksfmkmakls<strong>sdfdsfdsfdsf<em>dsdsds</em></strong><em>dsdsdsds</em></p>	1	\N
cmbmtrhno0001s01092qhyzoj	nerf-super-soaker-flip-fill-f8643	Nerf Super Soaker Flip Fill F8643	700	2025-06-07 22:47:43.14	2025-07-20 11:24:49.244	\N	\N	t	mfewkmkefkm	\N	1212		1	\N
cmbak8vr6000env10x8d6udxn	fisher-price-renkli-halkalar	Fisher Price Renkli Halkalar	650	2025-05-30 08:48:04.29	2025-09-13 05:58:20.64	\N	\N	t	\N	\N	0	<p></p>	6	\N
cmc09b94f0001mr0z7jx3crv9	fisher-price-elen-ren-ikl-ve-elenceli-oyuncak-piyano-trke-gtw20	Fisher Price Eğlen & Öğren Işıklı ve Eğlenceli Oyuncak Piyano Türkçe GTW20	1000	2025-06-17 08:23:59.727	2025-07-01 10:27:25.708	\N	\N	t	d	\N	121221	<p>212312333112</p>	0	\N
cmcrlbh9r000epb0zawyljgsg	hot-wheels-maceraya-baslangic-garaji-4-katli-gnl70	Hot Wheels Maceraya Başlangıç Garajı 4 Katlı	1299	2025-07-06 11:29:52.431	2025-07-22 20:09:15.746	\N	\N	t	GNL70	\N	1	<p></p>	9	\N
cmcn63vw60000mu10h359izmn	ednne-210210	Araba Fırlatan Dinazor Tır 159 cm.	1800	2025-07-03 09:12:59.19	2025-08-19 12:06:07.463	1600	\N	t	8694359090793	\N	20	<p></p>	2	\N
cmbhrzxr20000ns0zd29bm70r	multi-blocks-62-para	Multi Blocks 62 Parça	450	2025-06-04 09:59:27.134	2025-08-01 15:28:19.79	\N	cmbewfo1l0000qh10p5k9x8rl	t	1221o12o	\N	12		1	\N
cmcn7332z0000pb10k061tyhf	122112-440122121	Işıklı ve Sesli 30 Parça Classic Buharlı Tren Set	2000	2025-07-03 09:40:21.468	2025-09-12 17:46:51.282	1800	\N	t	8694359079217	\N	2121	<p></p>	18	\N
cmbapnxap0000qq10owzwczjm	fisher-price-eitici-hikaye-kitab-frc73	Fisher Price Eğitici Hikaye Kitabı FRC73	120	2025-05-30 11:19:44.209	2025-07-06 09:04:05.721	\N	\N	t	\N	\N	\N		1	\N
cmbndjoas0001o50zrguicv5s	zp-zp-tavan	 Zıp Zıp Tavşan	1400	2025-06-08 08:01:30.82	2025-07-01 18:33:17.539	\N	\N	t	120210e3	\N	120210		0	\N
cmblct1gx0000pe10hvwmu0q0	lollipop-ekilli-2-katmanl-makyaj-yapm-seti	Lollipop Şekilli 2 Katmanlı Makyaj Yapım Seti	320	2025-06-06 22:05:15.825	2025-07-06 09:04:18.112	\N	\N	t	12	\N	2121		4	\N
cmc3xyio80019ny10v2ewoorz	barbie-oyun-cadiri-ca12	Barbie Oyun Çadırı	600	2025-06-19 22:17:14.48	2025-06-19 22:17:14.48	\N	\N	t	ÇA12	\N	12	<p>Barbie Oyun Çadırı</p>	0	\N
cmc4zq6dh0001nz10nw1gxe62	acik-pembe-elbiseli-120021	Açık Pembe Elbiseli	970	2025-06-20 15:54:30.725	2025-06-20 15:54:30.725	\N	cmc4j3ffi0000ns10ktzkf0yt	t	120021	\N	20	<p>asi</p>	0	\N
cmbndifi10000o50zxl4zgfwr	deneme-120210120	deneme	120021	2025-06-08 08:00:32.761	2025-09-30 11:04:41.092	\N	\N	t	120210120	\N	1212	\N	2	\N
cmdnftoiy0000qg0z8df4tj9n	deneme-219219129	deneme	129192912	2025-07-28 18:24:41.579	2025-09-29 20:54:03.546	219219	\N	t	219219129	\N	912912921	<p></p>	15	2112212112
cmbo27zgp0002lf10cpzc9fly	cry-babies-loving-care-minnie-kostml-bebek-cyb69000	Cry Babies Loving Care Minnie Kostümlü Bebek CYB69000	2500	2025-06-08 19:32:15.817	2025-10-07 14:34:56.024	\N	\N	t	dsadaskasd	\N	2102100	<p style="text-align: left">dsadsa</p>	3	\N
cmc07crdx0000mw10p3fd8hvd	hot-wheels-city-ultimate-t-rex-tr-hng50	 Hot Wheels City Ultimate T-Rex Tır HNG50	4500	2025-06-17 07:29:10.82	2025-09-30 11:08:50.428	\N	\N	t	de120	\N	2121	<p>fsdfds</p>	3	\N
cmbewhy9n0002qh105gqstjlt	hot-wheels-hz-rampal-tr-hdy92	Hot Wheels Hız Rampalı Tır HDY92	1800	2025-06-02 09:42:07.546	2025-10-07 22:11:42.55	\N	\N	t	12002300312	\N	120210	<p></p>	5	\N
cmc3rdh0c0003pb10t6lufi9d	pembe	Pembe	2000	2025-06-19 19:12:54.867	2025-06-19 19:21:44.063	\N	cmbpdkq3x0004po109lx8slp6	t	1200	\N	120	<p>Eğlence ister ayakta ister oturarak devam edebilir. Çünkü scooterın çıkarılabilir oturağı 2 farklı kullanım şekli ile eğlencenin yanı sıra konfor da sunar. Yolculuklarına ayakta başla, uzun yolculuk seni yorduğunda ise eğlenceye oturarak devam et. Scooter keyfi sona erdiğinde katlanabilir yapısı sayesinde onu kolayca saklayabilir ve bir sonraki eğlence için hazırlayabilirsin.</p><p>&nbsp;</p><p>Ürünü kullanırken; kask, dizlik ve dirseklik gibi koruyucu aksesuarların takılmasına özen gösterilmelidir. Otoparklarda, merdivenlerde ve kalabalık yerlerde kullanılması uygun değildir. Kullanım esnasında ayrılmasını önlemek için doğru birleştirilip birleştirilmediği kontrol edilmelidir.</p><p>&nbsp;</p><p>Scooter, çocuklarınızın bedensel gelişimlerini ve dengede durabilme yetilerini olumlu yönde etkiler. Sürüş becerileri kazanmalarına ve sosyalleşmelerine katkı sağlar.</p>	0	\N
cmc3rpv8h0005pb10t18lfm6c	mavi-120000	Mavi	2000	2025-06-19 19:22:33.185	2025-06-19 19:22:33.185	\N	cmbpdkq3x0004po109lx8slp6	t	120000	\N	1200	<p></p>	0	\N
cmc3rsw5j0007pb10d4sduq4q	maxi-12000	Maxi	2100	2025-06-19 19:24:54.343	2025-06-19 19:24:54.343	\N	\N	t	12000	\N	120	<p>Cool Wheels scooter ile çocuklar eğlenceye sürecek!</p><p>&nbsp;</p><p>Sahilde, bahçede ve güvenli bütün alanlarda sonsuz macera sizleri bekliyor!</p>	0	\N
cmcx4bhbm000dpf0zogmr9drr	fisher-price-geveze-telefon-fgw66-fgw66	Fisher Price Geveze Telefon FGW66	1000	2025-07-10 08:20:36.082	2025-08-23 15:07:59.611	\N	\N	t	FGW66	\N	1200	<p></p>	4	\N
cmcrluthy000gpb0zbt4er5k5	barbie-isiltili-deniz-kizi-hdj36	Barbie Işıltılı Deniz Kızı	949	2025-07-06 11:44:54.742	2025-07-07 07:22:26.018	0	\N	t	HDJ36	\N	1	<p></p>	7	\N
cmc3v0rub000qpb10j4vmscq5	baby-clementoni-ilk-arkadaslarim-banyo-oyuncagi-cle17444	Baby Clementoni İlk Arkadaşlarım Banyo Oyuncağı	600	2025-06-19 20:55:00.85	2025-06-19 20:55:00.85	\N	\N	t	CLE17444	\N	21	<p>fsdfs</p>	0	\N
cmc3s3tk8000fpb10mgxtbi6q	twist-mavi-isikli-2020012	Twist Mavi Işıklı	900	2025-06-19 19:33:24.189	2025-08-29 20:12:01.472	\N	\N	t	2020012	\N	120	<p>Cool Wheels scooter ile çocuklar eğlenceye sürecek!</p><p>&nbsp;</p><p>Sahilde, bahçede ve güvenli bütün alanlarda sonsuz macera sizleri bekliyor!</p>	2	\N
cmcstj3ua000hof0zv5u3x0cu	candy-and-ken-sef-mutfak-seti-1751875651377	Candy & Ken Şef Mutfak Seti	879	2025-07-07 08:07:31.378	2025-07-21 11:19:07.174	\N	\N	t	\N	\N	1	<p></p>	1	\N
cmcsvmcwu000woa10zgwbnpqy	boubou-altini-islatan-bebek-seti-30-cm-1751879162332	Boubou Altını Islatan Bebek Seti 30 cm	519	2025-07-07 09:06:02.335	2025-07-07 09:49:29.118	0	\N	t	\N	\N	1	<p></p>	1	\N
cmcsuzyiz0003oa10dw4phu3e	ilk-yuruyus-arkadasim-1751878117257	İlk Yürüyüş Arkadaşım	1104	2025-07-07 08:48:37.26	2025-07-07 08:48:37.26	0	\N	t	\N	\N	1	<p></p>	0	\N
cmc3s0ml4000dpb105mt8hmh9	twist-scooter-200	Twist Scooter 	900	2025-06-19 19:30:55.192	2025-07-06 20:55:32.032	\N	\N	t	200	\N	200	<p>Cool Wheels scooter ile çocuklar eğlenceye sürecek!</p><p>&nbsp;</p><p>Sahilde, bahçede ve güvenli bütün alanlarda sonsuz macera sizleri bekliyor!</p>	4	\N
cmct7bz5d000gmm0zp6cjv059	candy-and-ken-market-set-bavulum-1751898833328	Candy & Ken Market Set Bavulum	660	2025-07-07 14:33:53.329	2025-08-13 14:06:15.267	600	\N	t	\N	\N	10	<p></p>	9	\N
cmcn7k9qb0001pb10ata8pl0a	barsad	Dikey Elektrik Süpürgesi 3in1 Yeşil	1200	2025-07-03 09:53:43.234	2025-07-06 12:34:13.695	\N	\N	t	10105	\N	10	<p></p>	3	\N
cmcuhd00w000dp810q923497a	unicorn-magic-oyun-cadiri-1751976143455	Unicorn Magic Oyun Çadırı	549	2025-07-08 12:02:23.457	2025-07-08 12:02:23.457	0	\N	t	\N	\N	1	<p></p>	0	\N
cmc3s9osl000hpb10llfekpbm	tulpar-m210	Tulpar	1300	2025-06-19 19:37:57.957	2025-07-07 14:57:29.36	\N	\N	t	M210	\N	200	<p>SDAKKASDMKSADKMSADKMSADM</p>	1	\N
cmckwnnar0003pa10wdjowwzd	redka-abaks-ve-ilem-seti	Redka Abaküs ve İşlem Seti	450	2025-07-01 19:12:52.659	2025-09-26 06:59:15.208	0	\N	t	211223	\N	1212	<p></p>	2	\N
cmcuhf0sc000gp810t886ymla	mesajli-boncuklar-taki-tasarim-seti-1751976237755	Mesajlı Boncuklar Takı Tasarım Seti	619	2025-07-08 12:03:57.756	2025-07-08 12:03:57.756	0	\N	t	\N	\N	1	<p></p>	0	\N
cmd8pqipn000bmz0zuzq7ks3l	yuruyus-arkadasim-clara-party-80-cm-mor-elbiseli-1752836737589	Mor Elbiseli	1499	2025-07-18 11:05:37.595	2025-07-18 12:15:00.912	\N	\N	t	\N	\N	1	<p></p>	0	\N
cmcykjtjg0007mk1039o6s1mo	barbie-kampa-gidiyor-oyun-seti-hdf73	Barbie Kampa Gidiyor Oyun Seti	799	2025-07-11 08:42:45.197	2025-07-15 08:16:14.426	\N	\N	t	HDF73	\N	1	<p></p>	1	\N
cmd4apcfx0005qj0zmsjng3in	frankie-stein-hxh73-hxh73	Frankie Stein HXH73	1800	2025-07-15 08:53:43.869	2025-07-21 11:12:36.25	\N	cmd4a2pab0001te0z111t23av	t	HXH73	\N	1	<p></p>	3	\N
cmct7a5eb000fmm0z2fm13tlj	candy-and-ken-cay-set-bavulum-1751898748114	Candy & Ken Çay Set Bavulum	680	2025-07-07 14:32:28.115	2025-07-20 22:17:38.116	600	\N	t	\N	\N	10	<p></p>	2	\N
cmf3r6k7v0002la0zxmztgaro	deneme-172772727272	Deneme	1200	2025-09-03 09:06:39.452	2025-09-19 17:41:36.432	0	\N	t	172772727272	\N	120	<p></p>	13	18283773737282
cmc3vdmbx0001ny10prg4lvxo	fisher-price-dnence-kelebekli-ryalar-cdn41	Fisher Price Dönence Kelebekli Rüyalar Cdn41 	2800	2025-06-19 21:05:00.237	2025-06-19 21:06:44.78	\N	\N	t	CDN41	\N	21	<ul class="list-disc ml-3"><li><p>Bu ürün yıldızlı ışık gösterisi olan bir dönenceden bağlantılı olması sayesinde bebek arabası aktivite merkezine dönüşür.</p></li><li><p>Yıldızlı ışık gösterisi duvarlara ve tavana yansıttığı desenler ie bebeğin odasını süsler.</p></li><li><p>3 farklı renkteki sevimli kelebekler bebeğin başının üstünde yavaşça döner, bebek onları gözüyle takip eder ve mutlu olur.</p></li><li><p>3 farklı müzik modu ile 30 dakikaya kadar ninnileri anne karnı sesleri veya dinlendirici doğa sesleri çalar.</p></li><li><p>Uzaktan kumanda kapı koluna asılabilir şekilde tasarlanmıştır.</p></li><li><p>Uzaktan kumanda sayesinde bebeği rahatsız etmeden dönence tekrar başlatılabilir.</p></li><li><p>Bebek büyüdüğünde dönence masa üstünde <em>müzikli projektör</em> olarak veya aktivite merkezi olarak kullanılabilir.</p></li></ul>	0	\N
cmc3w75de000jny104dcaflvp	vardem-vlektro-kutulu-61-tus-buyuk-lcd-ekranli-elektronik-buyuk-org-var12	Vardem Vlektro Kutulu 61 Tuş Büyük Lcd Ekranlı Elektronik Büyük Org	2000	2025-06-19 21:27:57.938	2025-06-19 21:27:57.938	\N	\N	t	VAR12	\N	12	<h1 style="text-align: left"><strong>Vardem Vlektro Kutulu 61 Tuş Büyük Lcd Ekranlı Elektronik Büyük Org</strong></h1>	0	\N
cmc3wmsxv000rny10mmu6r899	barbie-ve-eglenceli-havuzu-ghl91-ghl91	Barbie ve Eğlenceli Havuzu GHL91	900	2025-06-19 21:40:08.323	2025-06-19 21:40:08.323	\N	\N	t	GHL91	\N	12	<p>Barbie ve Eğlenceli Havuzu GHL91</p>	0	\N
cmc3wwbj0000uny1043vdgfn9	sesli-ve-isikli-2-in-1-luks-sac-bakim-seti-hua-1019	Sesli ve Işıklı 2 in 1 Lüks Saç Bakım Seti	900	2025-06-19 21:47:32.315	2025-06-19 21:47:32.315	\N	\N	t	HUA-1019	\N	1019	<p>Sesli ve Işıklı 2 in 1 Lüks Saç Bakım Seti</p>	0	\N
cmc3x0a6z000xny10ty1s617e	114-uzaktan-kumandali-ferrari-fxx-k-evo-araba-34-cm-ras	1:14 Uzaktan Kumandalı Ferrari FXX K Evo Araba 34 cm.	2600	2025-06-19 21:50:37.21	2025-06-19 21:50:37.21	\N	\N	t	Ras	\N	200	<p>1:14 Uzaktan Kumandalı Ferrari FXX K Evo Araba 34 cm.</p>	0	\N
cmdcvdvq70000p90zdl8um4z6	katlanabilir-metal-bebek-arabasi-baston-puset-fl8103-s	Katlanabilir Metal Bebek Arabası -Baston Puset	650	2025-07-21 08:54:50.335	2025-09-29 08:59:24.689	\N	\N	t	FL8103-S	\N	10	<p></p>	17	\N
cmc511mrz000anz10xnzcf5eu	twister-5010994640705	Twister	960	2025-06-20 16:31:24.815	2025-06-20 16:31:24.815	\N	\N	t	5010994640705	\N	12	<p>Twister ile eğlenceli oyunlara hazır olun!</p><p>&nbsp;</p><p>Elinizi kolunuzu, ayağınızı bacağınızı nereye koyduğunuza dikkat edin! Twister ile ayakta kalmak bir mucize!&nbsp;Twister, hem çocukları etkiliyor hem de büyükleri eğlendiriyor.</p><p>&nbsp;</p><p>Fiziksel becerilerine güvenen arkadaş grupları için özel tasarlanan Twister’da rakibinizi kıpırdatamayacak konuma getirin ve onu devirin, kazanan siz olun!</p><p>&nbsp;</p><p>Pratik kurulumu, kolay oynanması sayesinde de oyuncuları sıkmıyor, oyunu oynayanlar kadar izleyenleri de eğlendiriyor.</p><p>&nbsp;</p><p>Twister çarkını çevirin ve çıkan rengin alanlarını doldurmaya çalışın. Rakibinden fazla alan dolduran ve rakibini kıpırdatamayacak konuma getiren Twister oyuncusu, rekabeti kazanır. Birbirinden ilginç hareketlere ve devrilmeye hazırlanın; çünkü Twister oldukça fiziki beceri gerektirir.</p><p>&nbsp;</p><p>Oyuncu sayısı: 2 veya daha fazla.</p>	0	\N
cmchbxc720001pd1084a4pwph	multi-block-antal-120-para	Multi Block Çantalı 120 Parça	700	2025-06-29 07:09:14.366	2025-07-01 10:48:10.88	0	\N	t	210210021	\N	120	<p>dfsfd</p>	0	\N
cmc4jj1a90002ns10v9z5j7z9	koyu-pembe-elbiseli-30032	Koyu Pembe Elbiseli	970	2025-06-20 08:21:03.671	2025-07-06 13:23:32.233	\N	cmc4j3ffi0000ns10ktzkf0yt	t	30032	\N	200	<p></p>	1	\N
cmcsv3v4r0006oa10qtrg9j9n	barbie-dream-besties-paten-partisi-teresa-bebek-ve-aksesuarlar-jfx98	 Barbie Dream Besties Paten Partisi Teresa Bebek ve Aksesuarlar	1299	2025-07-07 08:51:39.483	2025-07-07 08:51:39.483	0	\N	t	JFX98	\N	1	<p></p>	0	\N
cmc50u3750007nz10crrpbrct	yesil-210201	Yeşil	1700	2025-06-20 16:25:32.849	2025-07-10 13:58:34.531	\N	cmc50sgq80005nz10yu6qr43e	t	210201	\N	201	<p></p>	5	\N
cmct2z6d20005n90zl4ty1nnf	masha-ile-koca-ayi-2li-figur-seti-mha21000	Masha İle Koca Ayı 2'li Figür Seti	1599	2025-07-07 12:31:57.686	2025-07-21 10:53:23.337	\N	\N	t	MHA21000	\N	1	<p></p>	5	\N
cmcsv6eya000aoa10saqjelf9	yeni-barbie-dream-besties-paten-partisi-brooklyn-bebek-ve-aksesuarlari-jfx97	Yeni Barbie Dream Besties Paten Partisi Brooklyn Bebek ve Aksesuarları	1499	2025-07-07 08:53:38.482	2025-07-07 09:05:57.347	0	\N	t	JFX97	\N	1	<p></p>	1	\N
cmc50uvsb0008nz10mdf3bb69	siyah-201021	Siyah	1700	2025-06-20 16:26:09.9	2025-07-07 07:28:14.078	\N	cmc50sgq80005nz10yu6qr43e	t	201021	\N	120	<p></p>	5	\N
cmckwv3df0005pa103pro9yt1	hareketli-sesli-tasmal-sevimli-kpeim-frappe	Hareketli Sesli Tasmalı Sevimli Köpeğim - Frappe	1200	2025-07-01 19:18:40.083	2025-07-07 08:50:50.428	90	\N	t	210120120	\N	12	<p>Hareketli Sesli Tasmalı Sevimli Köpeğim - Frappe</p>	3	\N
cmc3wbwum000mny10ixdfbsuy	cicciobello-cok-hastayim-cicciobello	Cicciobello Çok Hastayım	4300	2025-06-19 21:31:40.175	2025-07-07 10:03:39.3	\N	\N	t	Cicciobello	\N	20	<p></p>	2	\N
cmchc8j5h0000sc0zbxzr0pwa	fisher-price-eitici-tablet	Fisher Price Eğitici Tablet	1000	2025-06-29 07:17:56.596	2025-07-10 05:17:53.072	\N	\N	t	2102100210	\N	120	<p></p>	0	\N
cmc3w0u0z000gny10wf4hqeu4	uno-kartlar-klasik-2121	Uno Kartlar Klasik	300	2025-06-19 21:23:03.299	2025-07-16 07:30:12.807	\N	\N	t	2121	\N	21	<p></p>	2	\N
cmc50t8ho0006nz10f42dyfom	mavi-2021021	Mavi	1700	2025-06-20 16:24:53.052	2025-07-21 12:21:05.205	\N	cmc50sgq80005nz10yu6qr43e	t	2021021	\N	20	<p></p>	2	\N
cmcstm3m4000kof0zmq99jdpy	barbie-mutfak-sefi-1751875791050	Barbie Mutfak Şefi	999	2025-07-07 08:09:51.052	2025-07-16 08:01:52.603	0	\N	t	\N	\N	1	<p></p>	2	\N
cmc3xm0rj0013ny10cgd6b4xy	nerf-elite-commander-rd-6-e9485-e9485	Nerf Elite Commander RD-6 E9485	800	2025-06-19 22:07:31.404	2025-07-20 11:24:29.371	\N	\N	t	E9485	\N	120	<h1><strong>Nerf Elite Commander RD-6 E9485</strong></h1>	1	\N
cmc3vvoot000cny10qg4v32nd	smile-games-kbirik-3x3x3-zeka-kp	Smile Games Kübirik 3x3x3 Zeka Küpü	150	2025-06-19 21:19:03.101	2025-07-10 09:21:58.528	\N	\N	t	asal	\N	1221	<p>sdffsd</p>	2	\N
cmct2wgx40002n90znuda97l7	masha-ile-koca-ayi-figur-seti-mha23000	Masha İle Koca Ayı Figür Seti	1399	2025-07-07 12:29:51.401	2025-07-21 10:52:14.76	\N	\N	t	MHA23000	\N	1	<p></p>	1	\N
cmc3whhn2000pny10r8cx1avf	fisher-price-deluks-piyanolu-jimnastik-merkezi-fwt16-fwt16	Fisher Price Delüks Piyanolu Jimnastik Merkezi FWT16	3500	2025-06-19 21:36:00.398	2025-07-26 13:18:40.513	\N	\N	t	FWT16	\N	12	<p>Fisher Price Delüks Piyanolu Jimnastik Merkezi FWT16</p>	1	\N
cmdcwqfpo0002ry10baopxrma	katlanabilir-metal-kalp-desenli-bebek-arabasi-golgelikli-puset-fl6067-f	Katlanabilir Metal Kalp Desenli Bebek Arabası -Gölgelikli Puset	850	2025-07-21 09:32:35.723	2025-07-26 15:21:38.57	\N	\N	t	FL6067-F	\N	10	<p></p>	5	\N
cmck920xq0005rw109cdqvo70	barbie-pop-reveal-srpriz-bardak-oyun-seti-hrk57	Barbie Pop Reveal Sürpriz Bardak Oyun Seti HRK57	1700	2025-07-01 08:12:12.734	2025-07-04 10:25:54.046	0	\N	t	12210210	\N	120120012	<p>Renk değiştiren makyajlı ve kokulu Barbie bebek, kokulu ve yumuşacık evcil hayvan, şekillendirilebilir kum, kıyafetler ve farklı hikayelere ilham veren aksesuarlar gibi 15 sürpriz, bu kutudan çıkar. Ambalajından çıkarın, bardağın kapağını kaldırın ve saptaki düğmeye basarak Barbie'nin yukarıya çıkmasını izleyin. Sürpriz heyecanını tekrar tekrar yaşamak için bu hareketi tekrarlayın. Buz küplerini bastırarak açın ve sürprizleri keşfedin. Eğlenceyi tekrarlamak için buz küplerini yeniden kullanabilirsiniz. Gizemli paketlerde ek aksesuarlar bulunur. Meyve baskılı örtü, bir çift ayakkabı, deniz simitleri, şekillendirilebilir kum ve daha birçok aksesuar bulabilirsiniz.</p><p>&nbsp;</p><p>Güneşli bir günde eğlencenin tadını çıkarması için Barbie'yi giydirin ve yüzündeki renk değiştiren makyaj ile görünümünü değiştirin. Çocuklar, sürprizlerle dolu bu sette diledikleri gibi oynama özgürlüğünü keşfedecek. Tek bir sevimli hediye setinde 15'ten fazla sürpriz bulunan Barbie Pop Reveal Sürpriz Bardak bebeği ve aksesuarları, meyve temalı eğlencelerle dolu olan ve duyusal gelişimi destekleyen bir kutu açma deneyimi sunar.</p><p>&nbsp;</p><p>Çocuklar, dış ambalajı çıkarıp saptaki düğmeye basarak Barbie'nin sihirli bir şekilde yukarı yükselmesini izler. Barbie, sarı saçlarındaki pembe meçleri ve meyve temalı mayosuyla harika görünür. Koku özellikli yumuşacık evcil hayvan, renkli örtü ve plaj aksesuarları, Barbie için flamingo saç bandı, evcil hayvan güneş gözlüğü ve en iyi arkadaşlar için flamingo biçimindeki deniz simidi için paketleri açmaya devam edin.</p><p>&nbsp;</p><p>Sürpriz paketlerin ve bastırarak açılan buz küplerinin içinde ek parçaları keşfedin. Buz küplerinin içinde mini içecek ve Barbie'nin bir çift ayakkabısı bulunur. Küpleri kullanarak parçaları saklayın veya sürpriz heyecanını tekrar tekrar yaşayın. Şekillendirilebilir kum, kürek, kova ve denizyıldızı gibi diğer parçalarla farklı hikayeler için ilham alın ve kumdan eşsiz heykeller yapın.</p><p>&nbsp;</p><p>Bebeğin yüz makyajını ortaya çıkarmak için soğuk su kullanın. Eski haline döndürmek için ılık su kullanıp bu renk değişimi eğlencesini tekrarlayabilirsiniz. Çilek, yıldız veya yuvarlak şeker gibi, sete dahil 4 süs ile içecek kapağını süsleyin. Sürprizler ve eğlenceli parçalarla dolu olan Barbie Pop Reveal Sürprizli Bardak Oyun Seti, özellikle duyusal gelişim oyunlarını seven 3 yaş ve üzeri çocuklar için muhteşemdir.</p><p>&nbsp;</p><p>Barbie Pop Reveal Sürpriz Bardak Oyun Seti, oyun saatine renk katar ve çocukları Barbie bebekleri için çeşitli hikayeleri hayal etmeleri için teşvik eder. Çocuklar Barbie ile oynarken sınırsız hayal kurar.</p><p>&nbsp;</p><p>Kutu içerisinde; yeniden kullanılabilir kapak özellikli içecek bardağı, 1 koku ve renk değişimi özellikli Barbie, 1 kokulu ve yumuşacık evcil hayvan, 1 örtü, 1 saç bandı, 1 çift ayakkabı, 1 mini içecek bardağı, köpekçik için 1 güneş gözlüğü, 2 deniz simidi, 3 kum aksesuarı, 4 içecek süsü ve şekillendirilebilir kum torbası bulunmaktadır.</p><p>&nbsp;</p><p>Kutu ölçüsü: 32,5 x 13 x 14 cm</p><p>&nbsp;</p><p>Ağırlık: 0,860 kg</p>	0	\N
cmdecen9j0000t40zy2nh4ze3	art-craft-dinazor-disci-oyun-hamur-seti-03677	Art Craft Dinazor Dişçi Oyun Hamur Seti	500	2025-07-22 09:39:05.67	2025-08-24 16:19:52.909	\N	\N	t	03677	\N	10	<p></p>	10	
cmdd4ahx8000hqo0zrovjnpv9	flexi-super-bambu-cubuklar-03679	Flexi Süper Bambu Çubuklar	700	2025-07-21 13:04:09.021	2025-07-23 07:58:30.273	\N	\N	t	03679	\N	10	<p></p>	2	\N
cmfqvmrkl0001nv0itycstdnb	deneme-1758288595975	deneme	120120	2025-09-19 13:29:55.986	2025-10-13 15:55:53.253	120	\N	t	1231230	\N	120120	<p>dsadsa</p>	3	120210012
cmck9145m0004rw10uu8kdoy8	barbie-ve-stacie-kz-kardeler-2li-paket-hrm09	Barbie ve Stacie Kız Kardeşler 2'li Paket HRM09	1200	2025-07-01 08:11:30.251	2025-07-01 09:29:44.119	0	\N	t	2102010212100	\N	210	<p>Barbie ve Stacie birlikte yaz maceralarına atılıyor. Barbie ve Stacie Kurtarma Görevinde filmindeki gibi büyük kız kardeş Barbie, omuzları açık ve yakası fırfırlı bir elbise giyer. Sportif küçük kız kardeş Stacie ise parlak bir üst ve şort giyer. Fotoğraf makinesi, dürbün ve hasır şapka gibi aksesuarların yanı sıra iki köpekçik bu macerada kız kardeşlere eşlik eder. Bu sayede çocuklar, keşif tutkularını canlandırabilir.</p><p>&nbsp;</p><p>Barbie ve küçük kız kardeşi Stacie'nin yer aldığı bu bebek seti ile oyun oynarken kız kardeşlerin bağını güçlendirin. Yaz kıyafetleri ve aksesuarları, Barbie and Stacie to the Rescue adlı animasyon filmindeki tarzlardan ilham alınarak tasarlanmıştır. Her zaman muhteşem görünen büyük kardeş Barbie, omuzları açık ve yakası fırfırlı bir elbise ile spor ayakkabı giyer. Sportif ve maceracı kız kardeşi Stacie ise eğlenceli bir bluz, şort ve spor ayakkabı giyer. 3 yaş ve üzeri çocuklar fotoğraf makinesi, dürbün ve hasır şapkanın yanı sıra iki evcil köpekçik ile aile maceralarını canlandırabilir.</p><p>&nbsp;</p><p>Barbie bebek, oyun saatine renk katar ve çocukları Barbie bebekleri için çeşitli hikayeleri hayal etmeleri için teşvik eder. Çocuklar Barbie ile oynarken sınırsız hayal kurar. Yeni hikayeler oluşturarak hayal güçlerinin ve yaratıcılıklarının gelişmesini desteklerken onların koleksiyon merakına katkı sağlar.</p><p>&nbsp;</p><p>Kutu içerisinde; 2 adet bebek, 2 adet köpek figürü ve 3 adet aksesuar bulunmaktadır.</p><p>&nbsp;</p><p>Kutu ölçüsü: 32,5 x 5,5 x 20,5 cm</p><p>&nbsp;</p><p>Ağırlık: 0,612 kg</p>	0	\N
cmcuhh1ly000ip810jbai4j7l	jenga-a2120	Jenga	1059	2025-07-08 12:05:32.135	2025-07-21 12:19:41.669	\N	\N	t	A2120	\N	1	<p></p>	2	\N
cmd8pw0ru000hmz0z9m9zyfmz	barbie-sonsuz-hareket-bebegi-hrh27	Barbie Sonsuz Hareket Bebeği	649	2025-07-18 11:09:54.283	2025-07-19 16:37:51.735	0	\N	t	HRH27	\N	1	<p></p>	1	\N
cmcsvafsl000goa104t9j96jo	barbie-dream-besties-daisy-jean-bebek-jdd74	Barbie Dream Besties Daisy Jean Bebek	1500	2025-07-07 08:56:46.197	2025-07-07 10:07:15.662	\N	\N	t	JDD74	\N	1	<p></p>	2	\N
cmcsv8emh000doa10uh51ezlc	barbie-dream-besties-ana-karakter-bebegi-ken-jdd75	Barbie Dream Besties Ana Karakter Bebeği Ken	1099	2025-07-07 08:55:11.37	2025-07-20 22:05:11.27	\N	\N	t	JDD75	\N	1	<p></p>	2	\N
cmdcxbjie000bry10zetckvek	mavi-sm-699-231	Mavi	1050	2025-07-21 09:49:00.422	2025-07-21 13:37:22.829	\N	cmdcxanxx000ary10uonsdwsf	t	SM-699-231	\N	10	<p></p>	3	\N
cmct4oent0009mm0z0cle33jz	disney-frozen-anna-ve-elsa-2li-paket-hmk51	Disney Frozen Anna ve Elsa 2’li Paket	1449	2025-07-07 13:19:34.457	2025-07-09 10:48:30.974	0	\N	t	HMK51	\N	1	<p></p>	4	\N
cmcuhmrfb000op810u1ghpnnd	uno-flip-kart-oyunu-gdr44	Uno Flip Kart Oyunu	319	2025-07-08 12:09:58.871	2025-07-09 10:12:45.517	\N	\N	t	GDR44	\N	1	<p></p>	8	\N
cmcuhjdnz000lp810pur3qhi7	uno-deluks-turkce-1751976441070	Uno Delüks Türkçe	499	2025-07-08 12:07:21.071	2025-07-09 10:54:21.081	0	\N	t	\N	\N	1	<p></p>	1	\N
cmd4bvdhn000lqj0zk4xd9548	downtown-car-park-hdr28	Downtown Car Park	850	2025-07-15 09:26:24.779	2025-07-22 20:09:48.676	\N	cmd4bm99b000gqj0zn12ec2s0	t	HDR28	\N	1	<p></p>	15	\N
cmct4lyfk0005mm0zpk6sdkw4	lego-icons-kir-cicekleri-buketi-10313	LEGO Icons Kır Çiçekleri Buketi	2149	2025-07-07 13:17:40.112	2025-07-09 10:48:30.584	0	\N	t	10313	\N	1	<p></p>	1	\N
cmd4aulj90006qj0zmmbd3732	disney-karlar-ulkesi-sarki-soyleyen-anna-jdx53-jdx53	Disney Karlar Ülkesi Şarkı Söyleyen Anna JDX53	1980	2025-07-15 08:57:48.933	2025-08-13 14:06:50.323	\N	\N	t	JDX53	\N	4	<p></p>	2	\N
cmdcynu1y0000o10zypqdmebq	kirmizi-sm-699-231-1	Kırmızı	1050	2025-07-21 10:26:33.573	2025-07-26 15:21:20.538	\N	cmdcxanxx000ary10uonsdwsf	t	SM-699-231-1	\N	10	<p></p>	4	\N
cmd7jrb150002mq10ylsd8njd	turuncu-wy911b	Turuncu	750	2025-07-17 15:30:30.425	2025-07-19 15:19:30.877	\N	cmd7jpgb30000mq10si6ezuh9	t	WY911B	\N	10	<p></p>	6	\N
cmcsuec1g000nof0zb79azomy	candy-and-ken-doktor-set-bavulum-1751877108337	Candy & Ken Doktor Set Bavulum	680	2025-07-07 08:31:48.34	2025-07-21 11:16:08.196	600	\N	t	\N	\N	10	<p></p>	8	\N
cmct31qn50009n90zqi9qdb9n	masha-ile-koca-ayi-oyun-seti-mha22000	Masha İle Koca Ayı Oyun Seti	1999	2025-07-07 12:33:57.282	2025-07-18 09:33:21.158	\N	\N	t	MHA22000	\N	1	<p></p>	1	\N
cmd8ps9gc000dmz0z41ltvnwj	barbie-spa-gunu-bebegi-hkt91	Barbie Spa Günü Bebeği	899	2025-07-18 11:06:58.908	2025-07-18 12:16:27.32	\N	\N	t	HKT91	\N	1	<p></p>	1	\N
cmd7jqog20001mq10yg43re5s	kirmizi-wy911a	Kırmızı	750	2025-07-17 15:30:01.154	2025-07-19 15:19:19.725	\N	cmd7jpgb30000mq10si6ezuh9	t	WY911A	\N	10	<p></p>	4	\N
cmcx4g55a000hpf0zysh5jb4s	fisher-price-numarali-kaplar-k31232	Fisher Price Numaralı Kaplar	850	2025-07-10 08:24:13.583	2025-07-27 09:00:39.213	\N	\N	t	K31232	\N	219129921	<p></p>	6	\N
cmck8y6xn0001rw10l0mqcdtk	barbie-dondurma-dkkan-oyun-seti-hcn46	Barbie Dondurma Dükkanı Oyun Seti HCN46	120	2025-07-01 08:09:13.883	2025-07-01 09:33:02.254	0	\N	t	121212	\N	120	<p>Dondurmaya bayılan çocuklar bu oyun setiyle hayallerindeki dondurma mekanını işletip hazırladıkları lezzetli dondurmaları külahlara doldurabilir. Oyun seti; dondurma baskılı sevimli bir elbise ve çizgili önlük giyen Barbie, dondurma standı ve aksesuarlar içerir. Çocuklar, pembe ve mavi renkli iki çeşit oyun hamurunu dondurma makinesine yerleştirdikten sonra kolu çekip gerçeğe uygun dondurmaların döne döne külaha dolmasını izlerken eğlence dolu saatler geçirecek.</p><p>&nbsp;</p><p>Dondurmaları isterlerse kaselere isterlerse külaha doldurabilir, üstlerini süsleyip şahane görünen ikramlıklar hazırlayabilirler. Ardından kasayı açıp siparişi işleyebilirler. Oyun seti; Barbie, dondurma standı, 2 renkte oyun hamuru, 2 kase, 2 külah, 3 dekoratif dondurma süsü, 2 kaşık, külahlık ve kasa içerir. Bebek tek başına ayakta duramaz. Renkler ve süslemeler çeşitlilik gösterebilir. 3 yaş ve üzeri kızlar için harika bir hediyedir.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p>&nbsp;</p><p>Pasta yapmayı seven çocuklar bu oyun setiyle pasta dükkanı işletip lezzetli pastalar ve tatlılar hazırlayabilir. Oyun seti; çizgili sevimli bir elbise ve önlük giyen, pembe saçlarıyla havalı, minyon Barbie pastacı bebek içerir. Hikaye anlatımı eğlencesine ilham veren 20'den fazla aksesuarla birlikte fırın standında pasta hazırlamaya, süslemeye ve sergilemeye uygun üç oyun alanı bulunur. Çocuklar, pembe ve mavi renkli iki çeşit oyun hamurunu fırına yerleştirdikten sonra kolu çekip pastaların kabarmasını izlerken eğlence dolu saatler geçirecek. Çocuklar pişirdikleri pastayı ayaklı sunum tabağına aldıktan sonra pasta aksesuarları ve süsleriyle donatıp pastaya diledikleri şekli verebilir.</p><p>&nbsp;</p><p>Oyun setine; fırın standı, 30 cm Barbie bebek, 2 kutu oyun hamuru, pasta şekillendirici merdane, spatula, dekorlar, süsler, kapkek kutusu, kurabiye tabağı ve diğer aksesuarlar dahildir. Gerçeğe uygun oyun eğlencesi için Barbie bebek bazı aksesuarları tutabilir. Bebek tek başına ayakta duramaz. Renkler ve süslemeler çeşitlilik gösterebilir. 3 yaş ve üzeri çocuklar için harika bir hediyedir. Barbie Pasta Dükkanı oyun setiyle çocuklar bir pastane işletebilir ve pişirdikleri pastaları diledikleri gibi süsleyebilir. Pembe saçlı ve minyon Barbie bebek çizgili sevimli elbisesi ve önlüğüyle pasta yapmaya ve pastaları süslemeye hazır.</p><p>&nbsp;</p><p>Ürün ölçüsü: 29,3 x 12,7 x 5,4 cm</p><p>&nbsp;</p><p>Kutu ölçüsü: 32,3 x 22,9 x 6,5 cm</p><p>&nbsp;</p><p>Ağırlık: 0,505 kg</p>	0	\N
cmcvwjsqs000aqp10s9q8d8ub	sari-1202100	Sarı	1300	2025-07-09 11:55:21.028	2025-07-18 08:56:41.181	\N	cmcvwga540006qp106n9ajph6	t	1202100	\N	100	<p>Motormax 1:24 Volkswagen Type2 T3 modeli, efsanevi Volkswagen T3 minibüsün detaylı ve gerçeğe uygun replikasıdır. Yüksek kaliteli die-cast metal gövdesi ve ince işçilikle üretilmiş iç-dış detayları sayesinde hem koleksiyonerler hem de otomobil meraklıları için vazgeçilmez bir parçadır.</p>	12	\N
cmcvtl75u0004le10c21gte68	monopoly-turkiye-1610	Monopoly Türkiye	1700	2025-07-09 10:32:27.523	2025-07-10 09:14:07.348	\N	\N	t	1610	\N	10	<p></p>	9	\N
cmdd4taup0013qo0zeomf6yqb	akilli-cocuk-yapim-bloklari-60-parca-01022	Akıllı Çocuk Yapım Blokları 60 Parça	700	2025-07-21 13:18:46.321	2025-10-11 06:51:49.014	\N	\N	t	01022	\N	10	<p></p>	39	210210201201021
cmftedv8r0001rn0iaj7242iv	babycim	Babycim	200	2025-09-21 07:50:25.893	2025-10-13 10:05:36.534	20	\N	t	WY911A2	\N	22	<p></p>	7	\N
cmck8w87j0000rw10hjb7ose0	barbie-bebek-ve-gzel-at-oyun-seti-fxh13	 Barbie Bebek ve Güzel Atı Oyun Seti FXH13	1600	2025-07-01 08:07:42.224	2025-07-01 09:35:47.733	0	\N	t	210120	\N	210	<h3>Hayal gücünü yola çıkar!</h3><p>Atınla uyum içinde bir yolculuğun keyfini keşfetmeye başlayabilirsin çünkü Barbie ile oynarken istediğin her şeyi hayal edebilirsin.</p><p>Barbie bebek atını ve ata binmeyi çok seviyor! Hareketli eklemlere sahip Barbie bebeği atın üzerine yerleştirerek hayal güçlerinizdeki macera dolu oyunları canlandırabilirsiniz.</p><p>&nbsp;</p><p>Barbie pembe taytı, mavi puantiyeli bluzu ve şıklığını tamamlayan kahverengi çizmeleri ile çok sevimli gözükmektedir. Üstelik set içerisinde Barbie’nin güvenliği için pembe kaskı bulunmaktadır.</p><p>&nbsp;</p><p>Set içerisinde; Barbie bebek, at, atın eyeri ve kask yer almaktadır.</p><p>&nbsp;</p><p>Kutu ölçüsü: 35,6 x 8,3 x 32,4 cm</p><p>&nbsp;</p><p>Ağırlık: 0,700 kg</p>	0	\N
cmcvwcc860005qp10ejgc9l2n	obur-sincap-kutu-oyunu-1027817	Obur Sincap Kutu Oyunu	1000	2025-07-09 11:49:33.031	2025-07-15 08:21:25.021	\N	\N	t	1027817	\N	120	<p></p>	3	\N
cmct4w9tn000dmm0z7powidcq	kukuli-sarki-soyleyen-pelus-30-cm-1751894741434	Kukuli Şarkı Söyleyen Peluş 30 cm	1149	2025-07-07 13:25:41.436	2025-07-07 13:25:41.436	0	\N	t	\N	\N	1	<p></p>	0	\N
cmcx0eloh0005mp10olr3jaic	varta-longlife-aaa-ince-pil-1221010021	Varta Longlife AAA İnce Pil	150	2025-07-10 06:31:03.233	2025-07-26 19:01:43.714	120	\N	t	1221010021	\N	210	<p></p>	10	\N
cmck8s35w0001p410fd4hcing	barbie-ve-teknesi-oyun-seti-grg30	 Barbie ve Teknesi Oyun Seti GRG30	2000	2025-07-01 08:04:29.06	2025-07-06 13:43:26.823	10	\N	t	21021210210	\N	210210	<h3>Hayal gücünü yola çıkar!</h3><p>Atınla uyum içinde bir yolculuğun keyfini keşfetmeye başlayabilirsin çünkü Barbie ile oynarken istediğin her şeyi hayal edebilirsin.</p><p>Barbie bebek atını ve ata binmeyi çok seviyor! Hareketli eklemlere sahip Barbie bebeği atın üzerine yerleştirerek hayal güçlerinizdeki macera dolu oyunları canlandırabilirsiniz.</p><p>&nbsp;</p><p>Barbie pembe taytı, mavi puantiyeli bluzu ve şıklığını tamamlayan kahverengi çizmeleri ile çok sevimli gözükmektedir. Üstelik set içerisinde Barbie’nin güvenliği için pembe kaskı bulunmaktadır.</p><p>&nbsp;</p><p>Set içerisinde; Barbie bebek, at, atın eyeri ve kask yer almaktadır.</p><p>&nbsp;</p><p>Kutu ölçüsü: 35,6 x 8,3 x 32,4 cm</p><p>&nbsp;</p><p>Ağırlık: 0,700 kg</p>	1	\N
cmcsvdf60000koa10anx7wcnh	barbie-dream-besties-teresa-bebek-ve-aksesuarlari-hyc23	Barbie Dream Besties Teresa Bebek ve Aksesuarları	1099	2025-07-07 08:59:05.353	2025-07-07 08:59:05.353	0	\N	t	HYC23	\N	1	<p></p>	0	\N
cmcsvf7p9000noa10fm6m7yeh	barbie-dream-besties-barbie-brooklyn-bebek-ve-aksesuarlari-hyc22	Barbie Dream Besties Barbie Brooklyn Bebek ve Aksesuarları	1500	2025-07-07 09:00:28.989	2025-07-07 10:06:58.425	\N	\N	t	HYC22	\N	1	<p></p>	0	\N
cmcuhop7f000rp810ij04r8kf	uno-all-wild-hhl35hhl33	UNO All Wild	319	2025-07-08 12:11:29.307	2025-07-09 10:44:25.198	\N	\N	t	 HHL35/HHL33	\N	1	<p></p>	2	\N
cmd8q2ih6000pmz0zaybho98u	barbie-bebek-bakicisi-skipper-oyun-evi-seti-hhb67	Barbie Bebek Bakıcısı Skipper Oyun Evi Seti	1299	2025-07-18 11:14:57.163	2025-08-01 17:34:55.278	\N	\N	t	HHB67	\N	1	<p></p>	2	\N
cmct47nn2000en90zjw0bpww6	lego-classic-yaratici-canta-yapim-parcalari-10713	LEGO Classic Yaratıcı Çanta - Yapım Parçaları	699	2025-07-07 13:06:32.942	2025-07-07 13:06:32.942	0	\N	t	10713	\N	1	<p></p>	0	\N
cmcw3g0n20000mn109gx4vfev	tabu-xl-1212001	Tabu XL	2400	2025-07-09 15:08:21.95	2025-07-21 13:40:30.437	\N	\N	t	1212001	\N	1200	<p></p>	1	\N
cmct4k9wu0002mm0z3rx55heq	lego-speed-champions-nascar-next-gen-chevrolet-camaro-zl1-9-yas-ve-uzeri-cocuklar-icin-oyuncak-yaris-arabasi-yapim-seti-328-parca-76935	LEGO Speed Champions NASCAR Next Gen Chevrolet Camaro ZL1 – 9 Yaş ve Üzeri Çocuklar için Oyuncak Yarış Arabası Yapım Seti (328 Parça)	1049	2025-07-07 13:16:21.678	2025-07-09 09:31:51.904	0	\N	t	76935	\N	1	<p></p>	1	\N
cmcuhqao5000up810el16lhpo	2in1-scrabble-ingilizce-hwd43	2in1 Scrabble İngilizce	1000	2025-07-08 12:12:43.782	2025-07-09 10:52:39.478	\N	\N	t	HWD43	\N	1	<p></p>	3	\N
cmcvwz07q0001tb0zxx9f5g4y	mavi-rt980	Mavi	900	2025-07-09 12:07:10.55	2025-07-09 12:21:41.859	\N	cmcvwx8910000tb0zoy8db2pk	t	RT980	\N	10	<p></p>	7	\N
cmcvw8max0002qp10hmfgr7tw	hinzir-kedi-12211200	Hınzır Kedi	1000	2025-07-09 11:46:39.465	2025-07-09 12:38:01.739	\N	\N	t	12211200	\N	100	<p></p>	2	\N
cmc3ou9t00000pb10r5scf5x0	akac-korsan	Şakacı Korsan	800	2025-06-19 18:01:59.844	2025-07-10 06:10:12.699	\N	\N	t	T1200	\N	120	<p></p>	3	\N
cmcronqce000qpb0zfsbvkga4	mavi-855-311a	Mavi	440	2025-07-06 13:03:22.91	2025-07-10 06:15:56.493	400	cmcrom0d4000ppb0zar98p8xx	t	855-311A	\N	10	<p></p>	6	\N
cmcx3myde0000pf0z5h6xp5x4	fisher-price-egitici-kopekcigin-oyun-istasyonu-hrb70-hrb70	Fisher Price Eğitici Köpekçiğin Oyun İstasyonu HRB70	2000	2025-07-10 08:01:31.778	2025-07-10 08:02:31.502	\N	\N	t	HRB70	\N	10	<p></p>	0	\N
cmd8pzbkq000lmz0z5mifecf9	barbie-chelseanin-pervaneli-mini-ucagi-oyun-seti-htk38	Barbie Chelsea'nin Pervaneli Mini Uçağı Oyun Seti	909	2025-07-18 11:12:28.251	2025-07-20 13:01:49.347	\N	\N	t	HTK38	\N	1	<p></p>	0	\N
cmd8q0yz9000nmz0zd9ief4zp	barbie-veteriner-mini-oyun-seti-hrg50	Barbie Veteriner Mini Oyun Seti	1199	2025-07-18 11:13:45.237	2025-07-18 12:21:09.378	\N	\N	t	HRG50	\N	1	<p></p>	4	\N
cmd8pxna6000jmz0zwbmlm474	barbie-mavi-sacli-prenses-bebek-hrr16	Barbie Mavi Saçlı Prenses Bebek	1199	2025-07-18 11:11:10.111	2025-07-18 12:08:24.103	\N	\N	t	HRR16	\N	1	<p></p>	2	\N
cmck8lyiz0000p410lqz2z8yk	barbie-sa-tasarm-bst-jfg81	 Barbie Saç Tasarımı Büstü JFG81	2200	2025-07-01 07:59:43.115	2025-07-01 09:43:01.915	0	\N	t	132320	\N	120210	<p>&nbsp;</p><p>Renkli Barbie Saç Tasarımı Büstü ile saç tasarımcısı olmaya hazırsınız! Barbie'nin sarı saçlarında pastel tonlarda pembe, turuncu ve turkuaz tutamlar bulunur. Renk değişimi sürprizleri için sete dâhil olan kap ve sünger ile Barbie'nin tokalarını renkli saçları ile uyumlu hale getirebilirsiniz. Saç fırçası, saç lastikleri ve kıskaç tokalar gibi diğer renkli aksesuarlar ile çocuklar, hayallerindeki saç tasarımını gerçeğe dönüştürebilir. Saç tasarımı büstü, 3 yaş ve üzeri çocuklar için harika bir hediyedir.</p><p>&nbsp;</p><p>Barbie Saç Tasarımı Büstü ile saatler süren saç tasarımı eğlencesi başlasın! Renk değişimini görmek için Barbie'nin kıskaçlı tokalarını su dolu kaba batırın. Barbie'nin dudakları da renk değiştirebiliyor. Süngeri su ile ıslatmanız yeterlidir. Sınırsız hayal gücü, sayısız saç stili! Sete dâhil olan fırçayı kullanarak Barbie'nin renkli saçları ile örgüler, topuzlar, atkuyrukları ve daha pek çok saç stili yaratabilirsiniz. Barbie, saç aksesuarlarını paylaşmayı da çok sever! Çocuklar, kendi saçlarını da Barbie'nin saçları gibi şekillendirerek kıskaçlı tokalarını, saç lastiklerini, tacını ve lastik tokalarını kullanabilir. Onun saçlarını tekrar tekrar yapmak çok eğlenceli olacak! Barbie Saç Tasarımı Büstü, çocukları yaratıcı olmaya ve sanatçı ruhlarını sergilemeye teşvik eden muhteşem hediyelerdir.</p><p>&nbsp;</p><p>Barbie, oyun saatine renk katar, çocukları çeşitli hikâyeleri hayal etmeleri için teşvik ederken onların yaratıcılıklarının ve oyun kurma becerilerinin gelişmesine de katkı sağlar. Çocuklar Barbie ile oynarken sınırsız hayal kurar. Çocukların arkadaşları ile oynayacakları oyunlar sosyalleşmelerine yardımcı olur.</p><p>&nbsp;</p><p>Kutu içerisinde; tasarım büstü, 4 adet yıldız toka, 4 adet kelebek toka, 4 adet kıskaçlı toka, 3 adet saç lastiği, taç, tarak, kap ve sünger bulunmaktadır.</p><p>&nbsp;</p><p>Kutu ölçüsü: 38,5 x 14 x 29 cm</p><p>&nbsp;</p><p>Ağırlık: 0,900 kg</p>	0	\N
cmdd4emj5000nqo0zhdfy3exx	milanin-miami-evi-03766	Milanın Miami Evi	2000	2025-07-21 13:07:21.618	2025-07-21 20:32:22.915	\N	\N	t	03766	\N	10	<p></p>	2	\N
cmd8phoag0003mz0zqo5rddig	sesli-disney-karlar-ulkesi-sarki-soyleyen-elsa-bebek-jdx52	Sesli Disney Karlar Ülkesi Şarkı Söyleyen Elsa Bebek	1399	2025-07-18 10:58:44.92	2025-07-18 10:58:44.92	0	\N	t	JDX52	\N	1	<p></p>	0	\N
cmcrl3kcu000apb0z9nss9yiv	hot-wheels-kopek-baligi-tasiyici-gvg36	Hot Wheels Köpek Balığı Taşıyıcı	849	2025-07-06 11:23:43.182	2025-09-30 16:08:51.32	\N	\N	t	GVG36	\N	1	<p></p>	20	\N
cmck8i8wg0000ns10agxyr6cr	barbie-ken-fashionistas-65-yl-2li-parti-bebekleri-hxk90	Barbie & Ken Fashionistas 65. Yıl 2'li Parti Bebekleri HXK90	1500	2025-07-01 07:56:49.936	2025-07-01 09:46:12.57	0	\N	t	21021100	\N	2100012	<p>İkonik kıyafetlerin ve özgün tarzın 65. yılını kutlayan Barbie ve Ken Fashionistas <strong>bebekler</strong>, hem farklı hikayelere hem de yeni tarzlara ilham veriyor ve çeşitliliği kucaklamaya devam ediyor. 1980'lerdeki ikonik paten tarzlarından ilham alınarak tasarlanan bu iki bebek, kutudan birlikte çıkmaya hazır. Uyumlu çizgili kıyafetler ve altı adet aksesuar, stil seçeneklerini ve yaratıcı oyunları zenginleştirir.</p><p>&nbsp;</p><p>1980'lerdeki klasik paten tarzlarından ilham alınarak tasarlanan ve 6 adet aksesuara sahip olan Barbie ve Ken, kutudan çıkar çıkmaz paten kaymaya hazır! Çizgili pembe bluzu, kot şortu, halka küpeleri, uzun çorapları ve pembe patenleri ile Barbie, macera dolu hikayelere ilham verir. Ken parlak çizgili mor kazağı, yanları çizgili siyah şortu, çorapları ve beyaz patenleri ile tarzını sergiler. Hem oynamak hem de sergilemek için mükemmel olan Barbie ve Ken seti, 3 yaş ve üzeri çocuklar ile koleksiyoncular için harika bir hediyedir.</p><p>&nbsp;</p><p>Barbie, oyun saatine renk katar, çocukları çeşitli hikayeleri hayal etmeleri için teşvik ederken onların yaratıcılıklarının ve oyun kurma becerilerinin gelişmesine de katkı sağlar. Çocuklar Barbie ile oynarken sınırsız hayal kurar. Çocukların arkadaşları ile oynayacakları oyunlar sosyalleşmelerine katkı sağlar.</p><p>&nbsp;</p><p>Kutu içerisinde; Barbi, Ken, şapka, kulaklık, 2 adet gözlük, radyo ve su sişesi bulunmaktadır.</p><p>&nbsp;</p><p>Kutu ölçüsü: 25,5 x 6 x 32,5 cm</p><p>&nbsp;</p><p>Ağırlık: 0,580 kg</p>	0	\N
cmcw445y30004nr0zifmt68d1	make-n-break-junior-210210120	Make n Break Junior	1200	2025-07-09 15:27:08.572	2025-07-10 06:04:42.226	\N	\N	t	210210120	\N	120120	<p></p>	1	\N
cmcsvh4cc000qoa107ywfyhan	barbie-dream-besties-barbie-malibu-bebek-ve-aksesuarlari-hyc21	Barbie Dream Besties Barbie Malibu Bebek ve Aksesuarları	1500	2025-07-07 09:01:57.948	2025-07-07 10:06:44.332	\N	\N	t	HYC21	\N	1	<p></p>	0	\N
cmct4avnu000hn90zu7rcnk7z	lego-speed-champions-ford-mustang-dark-horse-spor-araba-9-yas-ve-uzeri-cocuklar-icin-koleksiyonluk-ve-sergilenebilir-yaratici-oyuncak-model-yapim-seti-344-parca-76920	LEGO Speed Champions Ford Mustang Dark Horse Spor Araba - 9 Yaş ve Üzeri Çocuklar için Koleksiyonluk ve Sergilenebilir Yaratıcı Oyuncak Model Yapım Seti (344 Parça)	1299	2025-07-07 13:09:03.307	2025-07-07 13:09:03.307	0	\N	t	76920	\N	1	<p></p>	0	\N
cmcsujscx000oof0zgqaf25td	candy-and-ken-mutfak-set-bavulum-1751877362766	Candy & Ken Mutfak Set Bavulum	680	2025-07-07 08:36:02.769	2025-07-21 11:16:32.77	600	\N	t	\N	\N	10	<p></p>	8	\N
cmd8q63mu000tmz0zw22y24oq	barbienin-ruya-botu-hjv37	Barbie'nin Rüya Botu	2699	2025-07-18 11:17:44.551	2025-07-26 15:22:29.263	\N	\N	t	HJV37	\N	1	<p></p>	4	\N
cmcvx35920008tb0zwqhkyo7u	pembe-rt980-1	Pembe	900	2025-07-09 12:10:23.702	2025-07-09 12:31:41.873	\N	cmcvwx8910000tb0zoy8db2pk	t	RT980-1	\N	100	<p></p>	3	\N
cmcuh28no0006p810wvmyfv5u	isikli-elektronik-kirmizi-org-24-tuslu-1751975641428	Işıklı Elektronik Kırmızı Org 24 Tuşlu	839	2025-07-08 11:54:01.429	2025-07-09 11:06:56.626	0	\N	t	\N	\N	1	<p></p>	6	\N
cmd4bg375000eqj0ztc5mqwds	96-nissan-180sx-type-x-ve-nissan-sileighty-jbk96-jbk96	96 Nissan 180sx Type X Ve Nissan Sileighty JBK96	700	2025-07-15 09:14:31.601	2025-09-19 11:36:23.882	\N	cmd4bawzu0009qj0zljjcecq7	t	JBK96	\N	3	<p></p>	19	\N
cmcx4k4h2000jpf0zqzblpb3f	fisher-price-renkli-bloklar-12219	Fisher Price Renkli Bloklar	800	2025-07-10 08:27:19.334	2025-08-23 15:07:58.07	\N	\N	t	12219	\N	29	<p></p>	5	\N
cmcugxvlm0001p810hl74xld5	lego-f1-koleksiyonluk-yaris-arabalari-6-yas-ve-uzeri-cocuklar-icin-yaratici-oyuncak-araba-yapim-seti-29-parca-71049	LEGO F1 Koleksiyonluk Yarış Arabaları - 6 Yaş ve Üzeri Çocuklar için Yaratıcı Oyuncak Araba Yapım Seti (29 Parça)	179	2025-07-08 11:50:37.883	2025-07-24 14:52:50.928	0	\N	t	71049	\N	1	<p></p>	3	\N
cmcw3k8mq0003mn10eczleu2m	cingoz-nine-kutu-oyunu-120210	Cingöz Nine Kutu Oyunu	1300	2025-07-09 15:11:38.93	2025-07-09 15:12:20.182	\N	\N	t	120210	\N	1200	<p></p>	1	\N
cmd4bcgcd000aqj0z9wfzshwj	morris-mini-ve-67-austin-mini-pickup-jbk97-jbk97	Morris Mini Ve 67 Austin Mini Pickup JBK97	700	2025-07-15 09:11:42.014	2025-09-23 09:42:05.562	\N	cmd4bawzu0009qj0zljjcecq7	t	JBK97	\N	3	<p></p>	12	\N
cmcw4377d0002nr0zyyci35se	make-n-break-junior-21210210120	Make n Break Junior	1300	2025-07-09 15:26:23.545	2025-07-09 16:15:48.436	\N	\N	t	21210210120	\N	210210	<p></p>	4	\N
cmd8q4k20000rmz0zzqi8ynkg	barbie-pasta-dukkani-hgb73	Barbie Pasta Dükkanı	1299	2025-07-18 11:16:32.521	2025-07-18 11:16:32.521	0	\N	t	HGB73	\N	1	<p></p>	0	\N
cmcxbsxlb0003p110eoywe4d0	barbie-skipper-bebek-bakiciligi-bebek-arabali-oyun-seti-gxt34	Barbie Skipper Bebek Bakıcılığı Bebek Arabalı Oyun Seti	949	2025-07-10 11:50:07.632	2025-07-10 12:50:26.515	0	\N	t	GXT34	\N	1	<p></p>	2	\N
cmcuh0ai80004p81095zg228w	cilek-desenli-4-tekerlekli-puset-1751975550511	Çilek Desenli 4 Tekerlekli Puset	1299	2025-07-08 11:52:30.512	2025-07-18 15:42:30.276	0	\N	t	\N	\N	1	<p></p>	1	\N
cmcx3pyef0002pf0zeuq98lk0	fisher-price-emeklemeyi-ve-saymayi-ogreten-kopekcik-hhh13-hhh13	Fisher Price Eğlen ve Öğren İzle ve Öğren Kumanda HHH27	900	2025-07-10 08:03:51.784	2025-07-20 11:22:34.07	\N	\N	t	HHH27	\N	1200	<p></p>	3	\N
cmd4ago8n0001qj0zpbm2bawv	cleo-denile-hhk54-hhk54	Cleo Denile Hhk54	1800	2025-07-15 08:46:59.255	2025-07-21 11:11:53.754	\N	cmd4a2pab0001te0z111t23av	t	HHK54	\N	1	<p></p>	10	\N
cmchcuvfx0000qj10k2kuq978	barbie-deniz-biyolou-oyun-seti-hmh26	Barbie Deniz Biyoloğu Oyun Seti HMH26	120210	2025-06-29 07:35:18.957	2025-07-01 09:50:14.617	0	\N	t	12221020021	\N	120012	<p>Çocuklar parçaları, açılıp kapanabilen laboratuvar kutusunda saklayabilir ve kutuyu setten çıkan çıkartma sayfasıyla süsleyebilir. Şnorkel, deniz altı canlıları (mesela bir yunus!) ve laboratuvar ekipmanıyla Barbie bebek, çocukları su altında maceraya çıkarıyor. Bu set 3 yaş ve üzeri çocukların hayallerini ve hayal dünyalarını geliştirmek için ideal bir settir. Bebek tek başına ayakta duramaz. Renkler ve süslemeler çeşitlilik gösterebilir.</p><p>&nbsp;</p><p>Çocuklar Barbie bebeklerine şnorkel, maske ve paletini giydirip su altını keşfetmeye başlayabilir. Yunus gibi renkli deniz altı canlıları ve bilimsel ekipmanlarla çocukların hayal dünyası istedikleri kadar derine dalabilir. Parçaları, gerçekten açılıp kapanabilen taşınabilir laboratuvarın içinde saklayıp istediğiniz yerde oyun oynayabilirsiniz.</p><p>&nbsp;</p><p>1 Barbie bebek, depolama alanı olan 1 taşınabilir bilim laboratuvarı, 1 yüzme yeleği, 1 şnorkel ve bir çift palet, 1 yunus, 1 balık, 1 deniz yıldızı, 1 mercan, 1 deniz kabuğu, 1 akvaryum, 1 ağ, 1 mikroskop, 1 not panosu, 1 fotoğraf makinesi ve 1 çıkartma sayfası dahildir.</p><p>&nbsp;</p><p>Ürün ölçüsü: 22 x 3 x 7 cm</p><p>&nbsp;</p><p>Kutu ölçüsü: 32 x 6,5 x 20 cm</p><p>&nbsp;</p><p>Ağırlık: 0,385 kg</p>	0	\N
cmct44w17000bn90zaw2eq6fz	lego-creator-3u-1-arada-vahsi-hayvanlar-sasirtici-orumcek-7-yas-ve-uzeri-cocuklar-icin-akrep-veya-yilana-donusebilen-yaratici-oyuncak-yapim-seti-153-parca-31159	LEGO Creator 3’ü 1 Arada Vahşi Hayvanlar: Şaşırtıcı Örümcek - 7 Yaş ve Üzeri Çocuklar için Akrep veya Yılana Dönüşebilen Yaratıcı Oyuncak Yapım Seti (153 Parça)	479	2025-07-07 13:04:23.852	2025-07-10 12:39:59.182	\N	\N	t	31159	\N	1	<p style="text-align: center"></p>	1	\N
cmcykfb6w0003mk10cbgtl7h8	barbie-chelseanin-agac-evi-hpl70	 Barbie Chelsea'nin Ağaç Evi	1299	2025-07-11 08:39:14.793	2025-07-11 08:39:14.793	0	\N	t	HPL70	\N	1	<p></p>	0	\N
cmchcpcgq0000pb10wianm7ey	barbie-bebek-ve-muhteem-aksesuarlar-fvj42	Barbie Bebek ve Muhteşem Aksesuarları FVJ42	900	2025-06-29 07:31:01.083	2025-07-01 09:53:57.783	0	\N	t	1212	\N	1221	<p>Barbie bebeğini havalı ve son moda kıyafetlerle gündelik veya resmi tarzda giydirebilir, ister gündüz ister gece, işe veya eğlenceye götürebilirsin.</p><p>&nbsp;</p><p>Elbise ve ayakkabı giyen Barbie bebeğin yanında toplam 5 ayakkabı, 3 cüzdan, güneş gözlüğü, çarpıcı bir kolye ve hikayeni tamamlayan bir aksesuar daha bulunuyor. Bu bebek ve aksesuar setlerindeki 11 aksesuarla kızlar yarattıkları hikayeye ve kendi stillerine uygun olarak Barbie bebeklerinin görünüşünü anında değiştirebilir.</p><p>&nbsp;</p><p>Barbie bebeğin tutabileceği pembe bir su şişesi gibi aksesuarlar, kızların hayal gücünü geliştirmeye yardımcı olur. Barbie bebekleri ve oyun setleri çocuğunuzun hayal gücünü, ifade yeteneğini ve keşif duygusunu oyun aracılığıyla destekleyerek unutulmaz anlar yaratmak için tasarlanmıştır.</p><p>&nbsp;</p><p>Kutu ölçüsü: 23 x 5,8 x 33 cm</p><p>&nbsp;</p><p>Ağırlık: 0,325 kg</p>	0	\N
cmcsuov8w000rof0zwxc3n9e8	barbie-mutfak-sefi-1751877599791	Barbie Mutfak Şefi	999	2025-07-07 08:39:59.793	2025-07-07 10:47:12.505	0	\N	t	\N	\N	1	<p></p>	1	\N
cmchchyya0000nv10e7m2fy21	barbie-3in1-denizkz-kostm-seti-jcp74	Barbie 3in1 Denizkızı Kostüm Seti JCP74	1100	2025-06-29 07:25:16.979	2025-07-01 10:05:23.05	0	\N	t	122100210	\N	120	<p>ile eğlence dolu bir dünyaya adım atıyoruz! Renkli kuyruğu ile bir anda mavi suların en zarif denizkızına dönüşebilir veya peri kanatlarını takıp özgürce uçabilir. Sade ama şık eteği ile her zaman ki gibi harika bir stil yakalayabilir. Göz alıcı kolyeleri, taçları ve ayakkabısı ile muhteşem görünümünü tamamlayacaktır. 3in1 Barbie Denizkızı Kostüm Seti ile oyunların sınırı yok!</p><p>&nbsp;</p><p>Su altı yolculuklarından göklerde uçmaya kadar sonsuz maceralar için Barbie’yi şekillendirebilir ve dönüştürebilirsiniz. Hangi macerayı yaşamak istediğinize siz karar verin! Tek bir, üç farklı tarz ve sayısız hikâye… Hayal gücünüzü serbest bırakıp eğlencenin keyfini çıkarmaya başlayabilirsiniz.</p><p>&nbsp;</p><p>Barbie, oyun saatine renk katar, çocukları çeşitli hikâyeleri hayal etmeleri için teşvik ederken onların yaratıcılıklarının ve oyun kurma becerilerinin gelişmesine de katkı sağlar. Çocuklar Barbie ile oynarken sınırsız hayal kurar. Çocukların arkadaşları ile oynayacakları oyunlar sosyalleşmelerine katkı sağlar.</p><p>&nbsp;</p><p>Paket içerisinde; Barbie bebek, denizkızı kuyruğu, peri kanadı, 2 adet taç, 2 adet kolye ve ayakkabı bulunmaktadır.</p><p>&nbsp;</p><p>Paket ölçüsü: 25,4 x 5 x 32,5</p><p>&nbsp;</p><p>Ağırlık: 0,275 kg</p><p><br></p>	0	\N
cmct5rm7s000emm0zfc1l6c7b	candy-and-ken-teknik-tamir-set-bavulum-1751896203831	Candy & Ken Teknik Tamir Set Bavulum	680	2025-07-07 13:50:03.832	2025-09-23 09:44:16.656	600	\N	t	\N	\N	10	<p></p>	4	\N
cmcuh7tyy0008p810jtqp6ihc	bebelou-konusan-bebek-32-cm-1751975902329	Bebelou Konuşan Bebek 32 cm	479	2025-07-08 11:58:22.331	2025-07-08 11:58:22.331	0	\N	t	\N	\N	1	<p></p>	0	\N
cmct4du4s000kn90zswbzw81d	lego-speed-champions-ferrari-f40-super-araba-9-yas-ve-uzeri-cocuklar-icin-insa-edilebilen-oyuncak-arac-modeli-yapim-seti-318-parca-76934	LEGO Speed Champions Ferrari F40 Süper Araba – 9 Yaş Ve Üzeri Çocuklar İçin İnşa Edilebilen Oyuncak Araç Modeli Yapım Seti (318 Parça)	1299	2025-07-07 13:11:21.222	2025-07-07 13:11:21.222	0	\N	t	76934	\N	1	<p></p>	0	\N
cmcuh9uab000ap810jkxell61	paw-patrol-oyun-cadiri-1751975996050	PAW Patrol Oyun Çadırı	549	2025-07-08 11:59:56.051	2025-07-09 10:35:56.18	\N	\N	t	\N	\N	1	<p></p>	0	\N
cmd4a5aty0002te0zza0cf6tk	draculara-hrp64-hrp64	Draculara HRP64	1800	2025-07-15 08:38:08.663	2025-08-25 01:32:44.885	\N	cmd4a2pab0001te0z111t23av	t	HRP64	\N	1	<p></p>	11	\N
cmcw3pz8i0006mn10yjvikmx0	canavar-avcilari-12120	Canavar Avcıları	1200	2025-07-09 15:16:06.69	2025-07-09 15:27:40.945	\N	\N	t	12120	\N	120020	<p></p>	2	\N
cmcx3ya7v0007pf0znsb7ewem	fisher-price-emeklemeyi-ve-saymayi-ogreten-kopekcik-hhh13-hhh132	Fisher Price Emeklemeyi ve Saymayı Öğreten Köpekçik HHH13	2000	2025-07-10 08:10:20.348	2025-07-10 08:29:31.524	\N	\N	t	HHH132	\N	12	<p></p>	1	\N
cmcxbpvrq0001p110w1np8f0o	barbie-skipper-bebek-bakiciligi-besikli-oyun-seti-hjy33	Barbie Skipper Bebek Bakıcılığı Beşikli Oyun Seti	899	2025-07-10 11:47:45.303	2025-07-10 12:50:58.848	0	\N	t	HJY33	\N	1	<p></p>	2	\N
cmcyk5rmt0001mk10jpxtkjgh	barbie-sesli-ve-isikli-magic-pegasus-ve-aksesuarlari-hlc40	Barbie Sesli ve Işıklı Magic Pegasus ve Aksesuarları	2199	2025-07-11 08:31:49.542	2025-07-11 08:31:49.542	0	\N	t	HLC40	\N	1	<p></p>	0	\N
cmdd2xwcx0000pd0zv4vcynlk	intex-29-cm-kutulu-pompa-ip68612	Intex 29 cm Kutulu Pompa	300	2025-07-21 12:26:21.585	2025-07-21 12:28:22.31	\N	\N	t	IP68612	\N	10	<p></p>	1	\N
cmcx41cc60008pf0zakc2c4d2	fisher-price-kaydir-ve-ogren-akilli-telefon-hnl48-hnl48	Fisher Price Kaydır ve Öğren Akıllı Telefon HNL48	900	2025-07-10 08:12:43.062	2025-08-23 15:08:02.627	\N	\N	t	HNL48	\N	2100210	<p></p>	1	\N
cmdd36txz0007pd0zzixat6q5	intex-baby-float-70-cm-bebek-simidi-ibf56585	Intex Baby Float 70 cm. - Bebek Simidi 	720	2025-07-21 12:33:18.359	2025-07-21 12:44:19.845	\N	\N	t	IBF56585	\N	10	<p></p>	2	\N
cmdd337h70004pd0z8j1vaiu1	intex-el-pompasi-ip69613	İntex El Pompası	200	2025-07-21 12:30:29.275	2025-07-21 13:25:42.898	\N	\N	t	IP69613	\N	10	<p></p>	2	\N
cmdd3yzoc0000qo0zqroftr3l	futbol-kale-seti-03645	Futbol Kale Seti	600	2025-07-21 12:55:12.156	2025-07-21 12:56:17.435	\N	\N	t	03645	\N	10	<p></p>	2	\N
cmc3us93o000lpb10m37qxx5t	eglen-ve-ogren-egitici-kopekcigin-aktivite-masasi-drh44	Eğlen ve Öğren Eğitici Köpekçiğin Aktivite Masası	4500	2025-06-19 20:48:23.315	2025-08-29 14:40:33.554	\N	\N	t	DRH44 	\N	1	<p>Bebeğiniz bu aktivite masasında 120'den fazla şarkı, melodi ve cümleyle 4 eğlenceli mekanı ; ev, pazar, çiftlik ve hayvanat bahçesini ziyaret ediyor.</p><p>&nbsp;</p><p>Bebek, bu öğrenme masasının her köşesinde keşfedecek yeni bir yer ve telefon, çıngıraklar, çemberler, düğmeler ve açıp kapanabilen kapılar olmak üzere birçok aktivite bulacak.</p><p>&nbsp;</p><p>Hayvanat bahçesine gidin ve silindiri döndürüp hayvanlar hakkında şarkılar dinleyin veya İngilizce ve Türkçe dillerinde şekilleri öğrenmek için düğmelere basın.</p><p>&nbsp;</p><p>Çiftliğe bir gezi düzenleyin ve çiftlikteki dostların selamlaması için ahır kapısını açıp kapayın.</p><p>&nbsp;</p><p>Piyano çalmak ve sayıları, yemekleri ve renkleri öğrenmek için tuşlara basın.</p><p>&nbsp;</p><p>Şimdi Köpekçik’in evine gidelim. Köpekçik’in alfabeyi sayışını dinlemek için evin kapısını açıp kapayın.</p><p>&nbsp;</p><p>Zıt anlamlıları öğrenmek için ise ışığı açın.</p>	2	\N
cmdd42zp00005qo0zp357br4u	super-bambu-cubuklar-200-parca-03461	Süper Bambu Çubuklar 200 Parça	450	2025-07-21 12:58:18.803	2025-07-22 10:08:37.772	\N	\N	t	03461	\N	10	<p></p>	2	\N
cmdd46vo4000bqo0z1fr3k37o	super-bambu-cubuklar-03462	Süper Bambu Çubuklar 300 Parça	550	2025-07-21 13:01:20.213	2025-07-22 10:11:50.925	\N	\N	t	03462	\N	10	<p></p>	2	\N
cmcsvj1t9000toa10lj4nfhwa	barbie-dream-besties-renee-bebek-ve-aksesuarlari-hyc24	Barbie Dream Besties Renee Bebek ve Aksesuarları	1500	2025-07-07 09:03:27.981	2025-10-06 09:46:01.585	\N	\N	t	HYC24	\N	1	<p></p>	22	\N
cmcys72030005mo0zn2abl24c	barbie-dreamtopia-bebek-ve-tek-boynuzlu-at-gtg01	Barbie Dreamtopia Bebek ve Tek Boynuzlu At	1149	2025-07-11 12:16:46.564	2025-07-15 08:17:45.93	\N	\N	t	GTG01	\N	1	<p></p>	1	\N
cmdna23je0007rn0zo2uvvpvj	lego-city-4x4-arazi-dag-arabasi-60447-6-yas-ve-uzeri-cocuklar-icin-yaratici-oyuncak-yapim-seti-221-parca-1753717396585	LEGO City 4x4 Arazi Dağ Arabası 60447 - 6 Yaş ve Üzeri Çocuklar için Yaratıcı Oyuncak Yapım Seti (221 Parça)	899	2025-07-28 15:43:16.586	2025-09-25 20:59:33.963	0	\N	t	\N	\N	1	<p></p>	6	\N
cmcys5da80003mo0zsts6kdfa	barbie-chelseanin-karavani-fxg90	Barbie Chelsea’nin Karavanı	1699	2025-07-11 12:15:27.872	2025-08-27 02:11:55.421	0	\N	t	FXG90	\N	1	<p></p>	3	\N
cmd8mb76u0000p80z29b4k6zj	12-parca-dinazor-hayvan-seti-sh-5903	12 Parça Dinazor Hayvan Seti	600	2025-07-18 09:29:43.973	2025-07-21 11:10:05.03	\N	\N	t	SH-5903	\N	10	<p></p>	1	\N
cmd8pf2ax0001mz0zm78iruop	disney-karlar-ulkesi-buz-pateni-temali-anna-bebek-jbg54	Disney Karlar Ülkesi Buz Pateni Temalı Anna Bebek	849	2025-07-18 10:56:43.113	2025-07-18 16:03:41.874	\N	\N	t	JBG54	\N	1	<p></p>	1	\N
cmbiwsv7c0000r10z7b36at2j	lol-surprise-fairies-tots-peri-bebei-srpriz-paket	L.O.L. Surprise Fairies! Tots Peri Bebeği Sürpriz Paket	12	2025-06-05 05:01:41.495	2025-07-28 13:19:49.968	\N	cmbewfo1l0000qh10p5k9x8rl	t	23123	\N	32	<h1>L.O.L. Surprise Fairies! Tots Peri Bebeği Sürpriz Paket</h1><p><br></p>	2	\N
cmd4am5xl0002qj0zwgrlkry2	clawdeen-wolf-hrp65-hrp65	Clawdeen Wolf HRP65	1800	2025-07-15 08:51:15.465	2025-07-21 11:12:13.855	\N	cmd4a2pab0001te0z111t23av	t	HRP65	\N	1	<p></p>	7	\N
cmd901h9w0003tg10wki4gicz	siyah-wy620b	Siyah	750	2025-07-18 15:54:05.107	2025-07-20 22:06:48.204	\N	cmd8zyaqd0002tg108zmo625c	t	WY620B	\N	10	<p></p>	8	\N
cmdn9t4nv0001rn0z3uj2e56g	lego-city-rb20-ve-amr24-f1-arabali-f1-kamyonu-60445-8-yas-ve-uzeri-cocuklar-icin-yaris-arabasi-iceren-yaratici-oyuncak-yapim-seti-1086	LEGO City RB20 ve AMR24 F1 Arabalı F1 Kamyonu 60445 - 8 Yaş ve Üzeri Çocuklar için Yarış Arabası İçeren Yaratıcı Oyuncak Yapım Seti 	3449	2025-07-28 15:36:18.139	2025-07-28 15:36:18.139	0	\N	t	1086	\N	1	<p></p>	0	\N
cmcykgw0c0005mk10oecw4v9v	barbie-dreamtopia-isiltili-balerin-hlc25	Barbie Dreamtopia Işıltılı Balerin	949	2025-07-11 08:40:28.429	2025-07-21 13:41:49.5	\N	\N	t	 HLC25	\N	1	<p></p>	3	\N
cmdncrnoe0000od0ze3ne5ewy	sdajiodsaijdsa-q219219129	sdajıodsaıjdsa	1200121	2025-07-28 16:59:08.318	2025-08-28 11:23:14.642	120120	\N	t	q219219129	\N	1020	<p>dwqkmwqdmkdwqmkdwqm</p>	3	129921912
cmdd4i10x000sqo0zz8f7hj49	lolanin-tatil-evi-03742	Lola'nın Tatil Evi	2000	2025-07-21 13:10:00.369	2025-08-13 13:52:47.568	\N	\N	t	03742	\N	10	<p></p>	6	\N
cmcx45g39000cpf0zp5f65hm3	fisher-price-eglen-ve-ogren-kopekcigin-oyun-macerasi-turkce-210210210	Fisher Price Eğlen ve Öğren Köpekçiğin Oyun Macerası Türkçe	900	2025-07-10 08:15:54.549	2025-08-23 15:08:00.835	\N	\N	t	210210210	\N	210210	<p></p>	3	\N
cmcvw34qa0000qp10p572bzd4	tombik-asci-ado30335	Tombik Aşçı	1300	2025-07-09 11:42:23.41	2025-07-10 08:36:34.171	\N	\N	t	ADO30335	\N	100	<p><strong>Minik Şeflerin Hayal Gücünü Geliştiren Eğlenceli Oyun!</strong></p><p>Tombik Aşçı Oyunu, çocukların yaratıcılığını ve el becerilerini geliştirmesi için tasarlanmış eğitici ve eğlenceli bir set. Renkli tasarımı ve detaylı aksesuarları sayesinde minik şefler, kendi mutfaklarını kurarak yemek hazırlama, malzemeleri tanıma ve servis etme gibi gerçek hayata dair rolleri öğrenirler.</p><ul class="list-disc ml-3"><li><p>Çocuklar için güvenli, kaliteli plastikten üretilmiştir.</p></li><li><p>Canlı renkleri ve detaylı mutfak aksesuarlarıyla gerçekçi tasarım.</p></li><li><p>Hayal gücünü, el-göz koordinasyonunu ve sosyal becerileri destekler.</p></li><li><p>Tombik Aşçı karakter figürü ve oyun mutfağı seti dahildir.</p></li><li><p>3 yaş ve üzeri çocuklar için uygundur.</p></li></ul><p>🎁 <strong>Neden Tombik Aşçı Oyunu?</strong></p><p>✅ Çocuğunuzun mutfak dünyasını keşfetmesini sağlar.<br>✅ Yaratıcılığını geliştirir, rol yapma oyunlarını destekler.<br>✅ Eğlenirken öğrenmesine katkıda bulunur.<br>✅ Hem kız hem erkek çocukları için ideal hediye seçeneğidir.</p>	7	\N
cmdn9zzru0005rn0zxe5i3hy0	lego-city-kirmizi-spor-araba-60448-5-yas-ve-uzeri-cocuklar-icin-yaratici-oyuncak-yapim-seti-109-parca-1753717298389	LEGO City Kırmızı Spor Araba 60448 - 5 Yaş ve Üzeri Çocuklar için Yaratıcı Oyuncak Yapım Seti (109 Parça)	349	2025-07-28 15:41:38.395	2025-09-25 20:59:01.244	0	\N	t	\N	\N	1	<p></p>	3	\N
cmcw3ynts0001nr0zlax9eo7o	cilgin-penguenler-12210120021	Çılgın Penguenler	1300	2025-07-09 15:22:51.809	2025-07-15 08:20:41.152	\N	\N	t	12210120021	\N	1200	<p><strong>Çılgın Penguenler</strong> oyunu, çocukların hem eğlenip hem de el-göz koordinasyonu geliştireceği heyecan dolu bir masa oyunudur! Buzdan platform üzerinde dengenizi koruyun, rakiplerinizi zekice eleyin ve ayakta kalan son penguen siz olun!</p><p>🎯 <strong>Oyunun Özellikleri:</strong></p><ul class="list-disc ml-3"><li><p>2 ile 4 oyuncu arasında oynanabilir.</p></li><li><p>Strateji, denge ve dikkat gerektirir.</p></li><li><p>Çocuklar için güvenli ve dayanıklı malzemeden üretilmiştir.</p></li><li><p>Kolay kurulum, taşınabilir tasarım.</p></li></ul>	4	\N
cmd906fy80005tg10vvsqao07	turuncu-wy912a	Turuncu	980	2025-07-18 15:57:56.673	2025-07-20 22:07:07.38	\N	cmd905jz70004tg10m3ahxbn9	t	 WY912A	\N	10	<p></p>	4	\N
cmd8pjjs20005mz0z568xuy7k	yuruyus-arkadasim-clara-sporty-80-cm-mor-esofmanli-takimli-1752836412380	Mor Eşofmanlı Takımlı	1499	2025-07-18 11:00:12.386	2025-07-18 12:15:39.464	\N	cmd8s17o0000umz0zflelva5j	t	\N	\N	1	<p></p>	8	\N
cmdn9y5hx0003rn0zn3agqpt7	lego-city-hurdalik-ve-arabalar-60472-7-yas-ve-uzeri-cocuklar-icin-yaratici-oyuncak-yapim-seti-871-parca-1753717212500	LEGO City Hurdalık ve Arabalar 60472 (871 Parça)	2599	2025-07-28 15:40:12.501	2025-07-28 18:16:18.266	\N	\N	t	60472	\N	1	<p></p>	6	5702017815121
cmd9072tz0008tg10iwcwdifq	mavi-wy912b	Mavi	980	2025-07-18 15:58:26.327	2025-07-21 05:32:11.917	\N	cmd905jz70004tg10m3ahxbn9	t	 WY912B	\N	10	<p></p>	6	\N
cmd8leys20000nv10kf1bt7aw	12-parca-vahsi-hayvan-set-sh-5901	12 Parça Vahşi Hayvan Set	600	2025-07-18 09:04:40.082	2025-07-21 11:09:19.909	\N	\N	t	SH-5901	\N	10	<p></p>	4	\N
cmd8mkl9b0003p80zi0n1qmhm	12-parca-ciftlik-hayvan-set-sh-5904	12 Parça Çiftlik Hayvan Set	600	2025-07-18 09:37:02.111	2025-07-21 11:09:44.78	\N	\N	t	SH-5904	\N	10	<p></p>	3	\N
cmeep4kjk0000nm10kt9q7odu	samsung-samsung12	Barbie 123	129921912	2025-08-16 20:14:52.928	2025-09-21 12:08:19.005	1929	\N	t	samsung12	\N	1299	<p></p>	27	321321321
cmcrkg8zi0006pb0z32v9i068	fisher-price-uyku-ve-oyun-arkadasi-su-samuru-fxc66	Fisher Price Uyku ve Oyun Arkadaşı Su Samuru	1799	2025-07-06 11:05:35.359	2025-10-07 18:07:00.4	\N	\N	t	FXC66	\N	1	<p></p>	204	\N
cmdd4oizf000xqo0zallsq500	akilli-cocuk-yapim-bloklari-01021	Akıllı Çocuk Yapım Blokları	500	2025-07-21 13:15:03.58	2025-10-07 19:12:42.955	\N	\N	t	01021	\N	10	<p></p>	31	\N
cmdbo1n5b0000tf0zlgllngyl	jasdijasdijidsa-1200120210df	Play-Doh Veteriner Seti F3639	1050	2025-07-20 12:41:35.856	2025-09-30 10:15:35.38	1000	\N	t	F3639	\N	20	<p></p>	41	\N
cmdna3z300009rn0zj3s36gka	lego-city-cankurtaran-kamyoneti-60453-6-yas-ve-uzeri-cocuklar-icin-2-minifigur-ve-kopek-baligi-figuru-iceren-yaratici-oyuncak-yapim-seti-214-parca-1753717484117	LEGO City Cankurtaran Kamyoneti 60453 - 6 Yaş ve Üzeri Çocuklar için 2 Minifigür ve Köpek Balığı Figürü İçeren Yaratıcı Oyuncak Yapım Seti (214 Parça)	829	2025-07-28 15:44:44.124	2025-08-29 07:05:43.658	0	\N	t	\N	\N	1	<p></p>	6	\N
cmd8pmrws0007mz0zywgwaqut	yuruyus-arkadasim-clara-sporty-80-cm-yesil-esofman-takimli-1752836562886	Yeşil Eşofman Takımlı	1499	2025-07-18 11:02:42.892	2025-07-18 12:37:42.537	\N	cmd8s17o0000umz0zflelva5j	t	\N	\N	1	<p></p>	4	\N
cmd8poczo0009mz0zjhdwh7br	yuruyus-arkadasim-clara-party-80-cm-pembe-elbiseli-1752836636864	Pembe Elbiseli	1499	2025-07-18 11:03:56.868	2025-07-18 16:04:36.389	\N	\N	t	\N	\N	1	<p></p>	2	\N
cmc7dh12k0000p810hyegxzpk	lego-technic-kazici-yukleyici-42197-42197	LEGO Technic Kazıcı Yükleyici 42197	450	2025-06-22 07:54:50.924	2025-07-16 07:59:50.943	390	\N	t	42197	\N	2	<p>şte erkek ve kız çocuklarla inşaat araçlarına meraklı herkes için eğlenceli bir yapım oyuncağı. Güvenilir LEGO® Technic Kazıcı Yükleyici (42197) oyuncağıyla 7 yaş ve üzeri çocuklar, her türlü inşaat işine hazır olacak! Bu eğlenceli setle genç model severler, birçok farklı inşaat görevini yerine getirebilir. Yükleyiciyi yerine sürün ve ekstra destek için destek ayaklarını indirin. Düğmeyi çevirerek ön kepçeyi kaldırıp indirin. Bir sonraki inşaat görevi için arka kazıcıyı deneyin. LEGO Technic araç setleri, gerçekçi hareketlerle genç LEGO severleri mühendislik evreniyle tanıştırır. Bu set yükleyicileri, ekskavatörleri ve kazıcı oyuncaklarını seven çocuklar için harika bir hediyedir. Modelleri 3 boyutlu yakınlaştırıp döndürebilecekleri, setleri kaydedebilecekleri ve ilerlemelerini takip edebilecekleri LEGO Builder uygulamasıyla çocuklara kolay ve sezgisel bir yapım macerası verin.;</p>	10	\N
cmcrksxem0007pb0zbtaeyw0f	fisher-price-eglen-ve-ogren-muzik-kutusu-turkce-konusan-aktivite-oyuncagi-gyc04	Fisher Price Eğlen ve Öğren Müzik Kutusu Türkçe Konuşan Aktivite Oyuncağı	1249	2025-07-06 11:15:26.878	2025-10-07 19:13:32.678	\N	\N	t	GYC04	\N	1	<p></p>	170	\N
cmdna5rue000brn0zjiu9k6az	lego-city-derin-deniz-keif-denizalts-60379-7-ya-ve-zeri-ocuklar-iin-ok-zellikli-yaratc-oyuncak-yapm-seti-842-para	LEGO City Derin Deniz Keşif Denizaltısı 60379 - 7 Yaş ve Üzeri Çocuklar için Çok Özellikli Yaratıcı Oyuncak Yapım Seti (842 Parça)	4199	2025-07-28 15:46:08.055	2025-10-08 16:02:05.407	\N	\N	t	60379	\N	1	<p></p>	14	132991329123
cmd4bnt4u000hqj0zmtifxckr	downtown-express-car-wash-hdr27	Downtown Express Car Wash 	850	2025-07-15 09:20:31.807	2025-10-10 19:31:00.065	\N	cmd4bm99b000gqj0zn12ec2s0	t	HDR27	\N	1	<p></p>	80	\N
cmfs54n5g0005nv0i8fq4g8x1	ati-1758365012752	ati	10	2025-09-20 10:43:32.775	2025-10-13 15:55:46.618	120	\N	t	\N	\N	10	<p></p>	12	120120021002
cmd4bjpad000fqj0z0va48y53	71-amc-javelin-ve-amc-rebel-machine-jbl06	71 Amc Javelin Ve Amc Rebel Machine 	700	2025-07-15 09:17:20.198	2025-09-29 08:59:24.69	\N	cmd4bawzu0009qj0zljjcecq7	t	JBL06	\N	2	<p></p>	19	\N
cmcvwikgf0009qp10qjb5hm91	yesil-mm-79376	Yeşil	1300	2025-07-09 11:54:23.632	2025-10-04 09:16:16.541	\N	cmcvwga540006qp106n9ajph6	t	MM-79376	\N	10	<p></p>	63	\N
cmc34bwuh0000pj10yz4xywma	sper-doktor	Süper Doktor	1300	2025-06-19 08:27:50.921	2025-10-08 17:04:21.756	\N	\N	t	1212000	\N	120210210	<p></p>	67	\N
cmd4br3r5000jqj0zsg2zga21	downtown-burger-drive-thru-hdr26	Downtown Burger Drive-Thru	850	2025-07-15 09:23:05.537	2025-10-16 07:56:24.323	\N	cmd4bm99b000gqj0zn12ec2s0	t	HDR26	\N	1	<p></p>	29	\N
cmct7jkyb000hmm0zgt5pxfi3	candy-and-ken-guzellik-set-bavulum-1751899188178	Candy & Ken Güzellik Set Bavulum	680	2025-07-07 14:39:48.18	2025-10-01 18:43:39.877	600	\N	t	\N	\N	10	<p></p>	32	\N
cmdcto4b00006pc0zn5uni77u	mavi-fr59205	Mavi	3000	2025-07-21 08:06:48.78	2025-10-07 19:13:18.006	2800	cmdctmc2a0000pc0zgr62c1eg	t	FR59205	\N	10	<p></p>	27	\N
cmdbmbs6l0003nw0z6kh2jmlr	baby-yoda-1202100an	Star Wars The Child Animatronic Baby Yoda F1119	4000	2025-07-20 11:53:29.709	2025-10-09 18:00:27.548	3600	\N	t	1202100AN	\N	210	<p></p>	121	\N
\.


--
-- Data for Name: ProductGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductGroup" (id, name, slug, description) FROM stdin;
cmbewfo1l0000qh10p5k9x8rl	Hot Wheels Tekli Arabalar	hot-wheels-tekli-arabalar	\N
cmbp070dy0000p010qva6ah41	dede	dede-1749468197300	\N
cmbpdkq3x0004po109lx8slp6	Combo 3 Tekerlekli Katlanabilir Işıklı Oturaklı Scooter	combo-3-tekerlekli-katlanabilir-isikli-oturakli-scooter-1749490672171	\N
cmc4j3ffi0000ns10ktzkf0yt	Tina Sporty Bebek 45 cm	tina-sporty-bebek-45-cm-1750406935515	<p>Tina Sporty Bebek 45 cm</p>
cmc50sgq80005nz10yu6qr43e	Crazon Çılgın Renkli Drift Uzaktan Kumandalı Araba	crazon-cilgin-renkli-drift-uzaktan-kumandali-araba-1750436657070	<ul class="list-disc ml-3"><li><p>15 km/h</p></li><li><p>2.4G</p></li><li><p>Işıklı</p></li><li><p>Full Fonksiyon</p></li><li><p>7.4V Batarya dahildir.&nbsp;</p></li><li><p>Kumanda 2x1.5V AA pil ile çalışmaktadır.&nbsp; Piller dahil değildir.</p></li><li><p>Uzunluk: 22,5 cm</p></li><li><p>Kutu Boyutu: 15x34x17 cm</p></li></ul>
cmcrom0d4000ppb0zar98p8xx	Masalcı Piyano Fil 	masalci-piyano-fil-1751806922578	<p></p>
cmcvwga540006qp106n9ajph6	Motormax 1:24 Volkswagen Type2 T3	motormax-124-volkswagen-type2-t3-1752061956951	<p></p>
cmcvwx8910000tb0zoy8db2pk	Işıklı ve Müzikli Eğtici Bultak Otobüs	isikli-ve-muzikli-egtici-bultak-otobus-1752062747651	<p></p>
cmd4a2pab0001te0z111t23av	Monster High Ana Karakter Bebekler HPD53	monster-high-ana-karakter-bebekler-hpd53-1752568567424	<p>Monster High Ana Karakter Bebekler HPD53</p>
cmd4bawzu0009qj0zljjcecq7	Hot Wheels Premium Car Culture 2'li Paket HBL96	hot-wheels-premium-car-culture-2li-paket-hbl96-1752570630280	<p>Hot Wheels Premium Car Culture 2'li Paket HBL96</p>
cmd4bm99b000gqj0zn12ec2s0	Hot Wheels Şehir Hayatı Serisi HDR24	hot-wheels-sehir-hayati-serisi-hdr24-1752571159390	<p>Hot Wheels Şehir Hayatı Serisi HDR24</p>
cmd7jpgb30000mq10si6ezuh9	1:16 Sürtmeli Sesli Işıklı Elektrikli Otobüs (Troleybüs)	116-surtmeli-sesli-isikli-elektrikli-otobus-troleybus-1752766143948	<p></p>
cmd8s17o0000umz0zflelva5j	Yürüyüş Arkadaşım Clara Sporty 80 cm	yuruyus-arkadasim-clara-sporty-80-cm-1752840595727	<h1>Yürüyüş Arkadaşım Clara Sporty 80 cm</h1>
cmd8s1cbj000vmz0zsmezu88j	Yürüyüş Arkadaşım Clara Sporty 80 cm	yuruyus-arkadasim-clara-sporty-80-cm-1752840601758	<h1>Yürüyüş Arkadaşım Clara Sporty 80 cm</h1>
cmd8s5t26000wmz0zossirjjh	Yürüyüş Arkadaşım Clara Party 80 cm	yuruyus-arkadasim-clara-party-80-cm-1752840810077	<p>Yürüyüş Arkadaşım Clara Party 80 cm</p>
cmd8s5ue0000xmz0z97s52hjl	Yürüyüş Arkadaşım Clara Party 80 cm	yuruyus-arkadasim-clara-party-80-cm-1752840811799	<p>Yürüyüş Arkadaşım Clara Party 80 cm</p>
cmd8zyaqd0002tg108zmo625c	1:16 Sürtmeli Sesli Işıklı Polis Arabası	116-surtmeli-sesli-isikli-polis-arabasi-1752853896660	<p>1:16 Sürtmeli Sesli Işıklı Polis Arabası</p>
cmd905jz70004tg10m3ahxbn9	1:16 Sürtmeli Sesli Işıklı Çift Katlı Turist Otobüsü	116-surtmeli-sesli-isikli-cift-katli-turist-otobusu-1752854235233	<h1 style="text-align: left"><strong>1:16 Sürtmeli Sesli Işıklı Çift Katlı Turist Otobüsü</strong></h1>
cmdctmc2a0000pc0zgr62c1eg	Cool Wheels Nova Full Led Işıklı Scooter	cool-wheels-nova-full-led-isikli-scooter-1753085125491	<p>Cool Wheels Nova Full Led Işıklı Scooter</p>
cmdcxanxx000ary10uonsdwsf	1.14 Kapıları Açılan Uzaktan Kumandalı Sportif Araba	114-kapilari-acilan-uzaktan-kumandali-sportif-araba-1753091299505	<p></p>
\.


--
-- Data for Name: ProductMedia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductMedia" ("productId", "mediaId", "order") FROM stdin;
cmftedv8r0001rn0iaj7242iv	cmc3ur153000kpb10tv83t3kz	0
cmftedv8r0001rn0iaj7242iv	cmdna39dx0008rn0zjv21k4l9	1
cmftedv8r0001rn0iaj7242iv	cmev9ogl60000qp0z79ijsm8g	2
\.


--
-- Data for Name: _AttributeToMedia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_AttributeToMedia" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _BrandToMedia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_BrandToMedia" ("A", "B") FROM stdin;
cmbak7nzv000cnv109dnryixo	cmbpddjnp0002po10q2k3uisl
cmbak745a000bnv10uigbk0aa	cmbpd6krg0000po1016qgyfwq
cmc3uzveg000ppb10aeu86mq4	cmck9oajb0000su1079lblquz
cmc3uuk4u000mpb10vqc7yzz1	cmck9rhjh0001su10gm5b9dv2
cmbak6wj8000anv10gevl1zqv	cmbp26kwb0000pf10tikxxmd9
cmc3wz4aj000wny105t1yu19y	cmck9walh0002su10vpguiu3z
cmc3xl5ih0012ny10crpw18b8	cmck9xzdi0003su10940wnzo5
cmc3vv38u000bny10dc5gqvyh	cmcka05610004su10ch9i3ts6
cmbak6rn90009nv10920aaoe3	cmcelpmpj0001n310m66pi8wy
cmbak829b000dnv10x2sakouc	cmbpd9phv0001po105g9tefyc
cmcrexshb0000mi107dtaceml	cmcrf0hfd0002mi107zwtjt8i
cmbbxq26f0005mo10yj4kjkrb	cmbp26kwb0000pf10tikxxmd9
cmcsv61dh0009oa107ejabpmo	cmcsvau9m000hoa10slooe82p
cmcrol5pr000npb0zaa3ywia6	cmct4mynj0006mm0zhsd83kx2
cmc3walor000lny10f5blvbup	cmct4ot4o000amm0zr4p7xhdp
cmcvrrptq0000o5101n6n420j	cmcwzj7sm0000mp1034cg38gh
cmcw6vuhu0000ll10nn796sgz	cmcwzkxpp0001mp10pwuz3w48
cmcw3p6gq0005mn101zz172i5	cmcwzmjko0002mp108wannsnf
cmcrfa8nk0001k010xpt1twm6	cmcssqcxb0000of0z496a3nyr
cmcvttbru0007le10eou08agg	cmcwzryma0003mp10851y9m3k
cmcvt59qp0000le106zfk9gfm	cmcwztojz0004mp10h9fmlhm2
cmd4a0gao0000te0z7dedv8hn	cmdd5e3m70017qo0zw8yftvck
cmd4avvd40008qj0z4805i854	cmev9ogl60000qp0z79ijsm8g
\.


--
-- Data for Name: _CategoryToMedia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_CategoryToMedia" ("A", "B") FROM stdin;
cmc3vwv0x000eny109do3a4gk	cmc3vwacp000dny100bmcf0vr
cmc3wfgyz000nny10vjzoywn5	cmc3wgpwu000ony10lj8513r9
cmc3wteww000tny10gjglmf7v	cmckf1hwm000qke0zui97ar63
cmc3vkal70006ny10juvtbllv	cmckr6r8i0000k4106zrcr9xp
cmc3xt0lo0015ny10t7co3k2h	cmbpdjjng0003po105ecrm380
cmc3v465d000spb108x2vlrwz	cmc3vcq800000ny10ojz3ewbv
cmc3vok0z0009ny10fzwfdtdg	cmc7d3hxq0000le10hg4khm09
cmc3uposx000jpb10iqwfqq2w	cmc3ur153000kpb10tv83t3kz
cmc3v34qe000rpb109jvg1p7y	cmckrifg20001k4100nil0y27
cmc3xu9f10017ny10hw20ior6	cmc3xxzbn0018ny10d4k15yw9
cmc3vle0r0008ny10475rr28b	cmckepopd000pke0zjtnw8rl5
cmc3xi3po0010ny10mhqoa2hc	cmc3xkujg0011ny10rdw6187j
cmc3xgtqg000zny10pd51mtal	cmckrshjt0005k4106f2koagn
cmc3xt9e20016ny1036o5b5n7	cmckrw4k00006k410mz6sydda
cmc3uw1wc000npb10c4c9v8b1	cmc3uxsec000opb104viqajzu
cmc3xa3gt000yny10bpfze0h7	cmcks7nhc0007k410cd5xq46e
cmc3xsajv0014ny109w98xco4	cmc3rwsj80009pb1043u0ncvn
cmc3vhnw00002ny10sgumtihu	cmc3vzmh7000fny10cs27egfs
cmbbxn2hj0002mo10apj7zda8	cmcdc245n0000qk108zkzmtch
cmc3vsde7000any10xa7hrli7	cmckdmbow000gke0ztjoafqlu
cmbwfg39e0001mp1071joskey	cmc50movc0003nz107cg4ih8l
cmbwfm9ui0000qm10jigjv6zd	cmckd2dwz000bke0zrvk2rc85
cmc3sfvsn000ipb108y6k1d78	cmc7eo8on0000my10ngc15cxc
cmc3vjj0a0005ny10xh5sju2i	cmckwbrzt0000pa102snc15vf
cmbwfp0bf0002qm10aqcsmmco	cmckwmr9t0002pa10gt7znmu1
cmbak5lg80006nv10ufvv8ys7	cmckconip0009ke0z7f487ut5
cmbak59e50004nv10gjsv0sot	cmc3wyjf1000vny10r2aze4ph
cmbak4igf0002nv108nyqh4tv	cmc50mwig0004nz10htr2zjq8
cmbbxomq90004mo10gj6xdgbu	cmckwtcj60004pa104yepm1eq
cmc3viyzk0004ny10js8bw2ae	cmc3xkujg0011ny10rdw6187j
cmc3vkwtr0007ny100ur0o78z	cmckwbrzt0000pa102snc15vf
cmc3vibio0003ny10sy1p4pk7	cmckejql6000nke0z5yxdecm4
cmcvtabq70003le10b6s3arpu	cmc51ksqr0000pm1022740tzp
cmcvt7ihq0001le108zt6oery	cmckdzo5o000kke0zuvwn8le7
cmbx961pg0000p810jfbe7atc	cmc3w3hw7000hny10pmqt5lya
cmbak64fx0008nv10yof20rr1	cmc3wyjf1000vny10r2aze4ph
\.


--
-- Data for Name: _ProductAttribute; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProductAttribute" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _ProductToBrand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProductToBrand" ("A", "B") FROM stdin;
cmcrol5pr000npb0zaa3ywia6	cmdna5rue000brn0zjiu9k6az
cmbak7nzv000cnv109dnryixo	cmftedv8r0001rn0iaj7242iv
\.


--
-- Data for Name: _ProductToCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_ProductToCategory" ("A", "B") FROM stdin;
cmc3uposx000jpb10iqwfqq2w	cmdna5rue000brn0zjiu9k6az
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts ("userId", scope, "createdAt", "updatedAt", id, "accessToken", "accessTokenExpiresAt", "accountId", "idToken", password, "providerId", "refreshToken", "refreshTokenExpiresAt") FROM stdin;
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content, rating, "userId", "productId", "createdAt") FROM stdin;
\.


--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.login_attempts (id, "createdAt", "userId", email, "ipAddress", "userAgent", success, reason) FROM stdin;
cmfwvpn4s0001qz0zsvjeuf40	2025-09-23 18:18:47.261	\N	deneme1234@gmail.com	149.140.214.118	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Email already exists
cmfz5um8m0001oj10amv6e4ka	2025-09-25 08:38:07.894	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Invalid password
cmfz5uuol0003oj102vqjvotx	2025-09-25 08:38:18.838	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmfz64s7l0001s1109uvmt8gi	2025-09-25 08:46:02.193	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmfz6dgih0001p10z26nmhppe	2025-09-25 08:52:46.937	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmfz6z0ur0003p10z7w3cg5i2	2025-09-25 09:09:33.075	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Invalid password
cmfz6za0j0005p10zu9yvkp9b	2025-09-25 09:09:44.947	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmfz73hs80001mt10rcnguxyi	2025-09-25 09:13:01.641	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmfz74pyp0003mt10vyxbc0hg	2025-09-25 09:13:58.897	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmfz75ibn0005mt10qtridmr5	2025-09-25 09:14:35.652	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Invalid password
cmfz75sgq0007mt10nav7950s	2025-09-25 09:14:48.794	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmfz784sy0009mt10o0ty9ouq	2025-09-25 09:16:38.098	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmfz7aae6000bmt100e5z1ru8	2025-09-25 09:18:18.655	\N	sematas@gmail.com	85.104.223.20	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	f	User not found
cmfz7ahoa000dmt10dljgy9q2	2025-09-25 09:18:28.09	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36	t	Login successful
cmfzpfycw0001oa107s2fao8o	2025-09-25 17:46:36.079	\N	sematas@gmail.com	95.70.207.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	f	User not found
cmfzpgnnj0003oa10hs5z1thd	2025-09-25 17:47:08.864	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	t	Login successful
cmg0k8z0w0001mp1016qck71c	2025-09-26 08:08:58.447	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.77	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmg0kb5110003mp10pco1gobk	2025-09-26 08:10:39.542	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.77	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmg47jzoc0001mx0zu6npo656	2025-09-28 21:24:42.203	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmg4a52sb0005n20zistccwzf	2025-09-28 22:37:05.244	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.2	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	t	Login successful
cmg4azroc0003t80zg573whxa	2025-09-28 23:00:57.181	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Invalid password
cmg4azw7i0005t80z5r7zudfh	2025-09-28 23:01:03.055	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmg4bcce20004p4106yrs359u	2025-09-28 23:10:43.899	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.2	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	t	Login successful
cmg4bviwv000gp410bvikis2j	2025-09-28 23:25:38.815	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmg4vdajd0003li0zjk7caj0t	2025-09-29 08:31:20.473	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmg4vfgtf0005li0zkhpzmpbh	2025-09-29 08:33:01.923	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmg6ejqy20003o410upmpv4yi	2025-09-30 10:16:00.554	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmg8dqjc7000kow0zp5yh088t	2025-10-01 19:28:50.023	\N	sematas@gmail.com	95.70.207.2	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	f	User not found
cmg8drdgp000mow0zhg6ns0ur	2025-10-01 19:29:29.065	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.2	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	f	Invalid password
cmg8drt0f000oow0z3u1bhjk7	2025-10-01 19:29:49.215	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	95.70.207.2	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	t	Login successful
cmgc248f90009qv0z6ylen8am	2025-10-04 09:14:38.373	\N	mehmetonurtass@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Email already exists
cmgc24o04000bqv0zx58sinrb	2025-10-04 09:14:58.564	cmepi3izb0000ng0zag6jyzw7	mehmetonurtass@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Invalid password
cmgc24vjx000dqv0zmh93xtr8	2025-10-04 09:15:08.35	cmepi3izb0000ng0zag6jyzw7	mehmetonurtass@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Invalid password
cmgc255me000fqv0zesemuy1h	2025-10-04 09:15:21.398	cmepi3izb0000ng0zag6jyzw7	mehmetonurtass@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Invalid password
cmgc25oif000iqv0zhw97t917	2025-10-04 09:15:45.879	cmgc25oib000gqv0zbucxfmhr	mehmetonurtass02@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Registration successful
cmgc264a4000kqv0zoynx1hlb	2025-10-04 09:16:06.317	cmgc25oib000gqv0zbucxfmhr	mehmetonurtass02@gmail.com	95.70.207.2	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmgghnk8a0001ne10pj7excmk	2025-10-07 11:40:39.081	\N	sematas@gmail.com	85.104.223.20	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	f	User not found
cmggi1v910001nt10sgizhu8f	2025-10-07 11:51:46.549	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	t	Login successful
cmggvq2200001tf0z522e24n6	2025-10-07 18:14:30.12	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
cmgi8marm0003qd10knn97upa	2025-10-08 17:03:15.97	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	176.216.239.74	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	t	Login successful
cmgl87fbs0001k410x4cqv2ck	2025-10-10 19:15:00.566	\N	sematas@gmail.com	85.104.223.20	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	f	User not found
cmgl87rk80003k4109t4t1fgi	2025-10-10 19:15:16.425	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	t	Login successful
cmgl8so8m0003qc100g1nj5w0	2025-10-10 19:31:31.894	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	f	Invalid password
cmgt4j0ko0001o110rtwczgiy	2025-10-16 07:54:12.264	\N	admin@example.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	User not found
cmgt4mde20006o110henfqt1q	2025-10-16 07:56:48.842	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	f	Invalid password
cmgt4mndv0008o110t81sg4d4	2025-10-16 07:57:01.795	cmemlxa9m0002p80z9aigtoa2	deneme123@gmail.com	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	t	Login successful
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions ("userId", "expiresAt", "createdAt", "updatedAt", id, "ipAddress", "userAgent", "sessionToken", "isActive", "lastAccessAt") FROM stdin;
cmemlxa9m0002p80z9aigtoa2	2025-10-23 07:57:01.788	2025-10-16 07:57:01.789	2025-10-16 09:17:36.118	bc6a69702cab16fc6b38332b1be34fb2aab277e8992c8baad0b01285343ef12e	85.104.223.20	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15	bc6a69702cab16fc6b38332b1be34fb2aab277e8992c8baad0b01285343ef12e	t	2025-10-16 09:17:36.117
cmemlxa9m0002p80z9aigtoa2	2025-10-17 19:15:16.413	2025-10-10 19:15:16.415	2025-10-13 13:52:49.581	e20442d361a9707e08ad350cf0a5f9048a9be100d0d1d5a6042305af46541a09	85.104.223.20	Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1	e20442d361a9707e08ad350cf0a5f9048a9be100d0d1d5a6042305af46541a09	t	2025-10-13 13:52:49.58
cmfwvjkzq0000mw10em6euhwk	2025-10-23 18:19:55.294	2025-09-23 18:19:55.295	2025-09-23 18:19:55.295	cmfwvr3mm0003qz0zoef8i7zz	\N	\N	cffcd3f8a5eef2edef054cae276a3c4abf71cc24103a601324d3392221ef336c	t	2025-09-28 08:57:51.93
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, "emailVerified", image, "createdAt", "updatedAt", password, role, "failedLoginCount", "lockedUntil", "lastLoginAt", "lastLoginIp") FROM stdin;
cmeo95gh90006s20zazo8amey	Onur	onurtas@gmail.com	f	\N	2025-08-23 12:45:22.221	2025-08-23 12:45:22.221	$2b$10$3CjCZSAlbJdz2TvSMsiw/uvlKBXOPVR5FAUlR403eFKayOtfU.nrG	USER	0	\N	\N	\N
cmepi3izb0000ng0zag6jyzw7	mehmet onur taş	mehmetonurtass@gmail.com	f	\N	2025-08-24 09:43:34.872	2025-08-24 09:43:34.872	$2b$10$JcDW72tzHU7IBR2IOueLP.y0np11BQ/xOBrZZPkavHujHJK8aUG5S	USER	0	\N	\N	\N
cmfwvjkzq0000mw10em6euhwk	deneme111	deneme1234@gmail.com	t	\N	2025-09-23 18:14:04.55	2025-09-23 18:14:04.55	$2b$12$xRPir8oqvVdHw49rfJN0..fn1x5BUxOvcD5FVZmdYFGmFEXb5x4ri	USER	0	\N	\N	\N
cmgc25oib000gqv0zbucxfmhr	onur tas	mehmetonurtass02@gmail.com	t	\N	2025-10-04 09:15:45.875	2025-10-04 09:16:06.322	$2b$12$Dvf9y4K/60zQzFXs/2e0cOLI7I8RTCwb5KrA4hvfDOH1eTitBLnxi	USER	0	\N	2025-10-04 09:16:06.321	95.70.207.2
cmemlxa9m0002p80z9aigtoa2	deneme	deneme123@gmail.com	f	\N	2025-08-22 09:07:23.578	2025-10-16 07:57:01.803	$2b$10$uumTY7C.UXpB2lFih.UUh.hUhMJbrieasWIUmdIYbxe8Vx.POx3Ay	USER	0	\N	2025-10-16 07:57:01.802	85.104.223.20
\.


--
-- Data for Name: verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verifications (id, "createdAt", "updatedAt", identifier, value, "expiresAt", type, used) FROM stdin;
\.


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: AttributeGroup AttributeGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AttributeGroup"
    ADD CONSTRAINT "AttributeGroup_pkey" PRIMARY KEY (id);


--
-- Name: Attribute Attribute_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attribute"
    ADD CONSTRAINT "Attribute_pkey" PRIMARY KEY (id);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Favorite Favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: MediaFile MediaFile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaFile"
    ADD CONSTRAINT "MediaFile_pkey" PRIMARY KEY (id);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ProductGroup ProductGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductGroup"
    ADD CONSTRAINT "ProductGroup_pkey" PRIMARY KEY (id);


--
-- Name: ProductMedia ProductMedia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductMedia"
    ADD CONSTRAINT "ProductMedia_pkey" PRIMARY KEY ("productId", "mediaId");


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: _AttributeToMedia _AttributeToMedia_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_AttributeToMedia"
    ADD CONSTRAINT "_AttributeToMedia_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _BrandToMedia _BrandToMedia_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BrandToMedia"
    ADD CONSTRAINT "_BrandToMedia_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _CategoryToMedia _CategoryToMedia_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CategoryToMedia"
    ADD CONSTRAINT "_CategoryToMedia_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _ProductAttribute _ProductAttribute_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductAttribute"
    ADD CONSTRAINT "_ProductAttribute_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _ProductToBrand _ProductToBrand_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductToBrand"
    ADD CONSTRAINT "_ProductToBrand_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _ProductToCategory _ProductToCategory_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductToCategory"
    ADD CONSTRAINT "_ProductToCategory_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: login_attempts login_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT login_attempts_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verifications verifications_identifier_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_identifier_type_key UNIQUE (identifier, type);


--
-- Name: verifications verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_pkey PRIMARY KEY (id);


--
-- Name: Brand_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Brand_slug_key" ON public."Brand" USING btree (slug);


--
-- Name: CartItem_cartId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CartItem_cartId_productId_key" ON public."CartItem" USING btree ("cartId", "productId");


--
-- Name: Cart_sessionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cart_sessionId_idx" ON public."Cart" USING btree ("sessionId");


--
-- Name: Cart_status_expiresAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cart_status_expiresAt_idx" ON public."Cart" USING btree (status, "expiresAt");


--
-- Name: Cart_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cart_userId_idx" ON public."Cart" USING btree ("userId");


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Favorite_userId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Favorite_userId_productId_key" ON public."Favorite" USING btree ("userId", "productId");


--
-- Name: Order_invoiceId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Order_invoiceId_key" ON public."Order" USING btree ("invoiceId");


--
-- Name: Order_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_status_idx" ON public."Order" USING btree (status);


--
-- Name: Order_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_userId_idx" ON public."Order" USING btree ("userId");


--
-- Name: ProductGroup_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProductGroup_slug_key" ON public."ProductGroup" USING btree (slug);


--
-- Name: Product_barcode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_barcode_key" ON public."Product" USING btree (barcode);


--
-- Name: Product_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_isActive_idx" ON public."Product" USING btree ("isActive");


--
-- Name: Product_serial_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_serial_key" ON public."Product" USING btree (serial);


--
-- Name: Product_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_slug_idx" ON public."Product" USING btree (slug);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: _AttributeToMedia_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_AttributeToMedia_B_index" ON public."_AttributeToMedia" USING btree ("B");


--
-- Name: _BrandToMedia_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_BrandToMedia_B_index" ON public."_BrandToMedia" USING btree ("B");


--
-- Name: _CategoryToMedia_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_CategoryToMedia_B_index" ON public."_CategoryToMedia" USING btree ("B");


--
-- Name: _ProductAttribute_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProductAttribute_B_index" ON public."_ProductAttribute" USING btree ("B");


--
-- Name: _ProductToBrand_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProductToBrand_B_index" ON public."_ProductToBrand" USING btree ("B");


--
-- Name: _ProductToCategory_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_ProductToCategory_B_index" ON public."_ProductToCategory" USING btree ("B");


--
-- Name: login_attempts_email_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "login_attempts_email_createdAt_idx" ON public.login_attempts USING btree (email, "createdAt");


--
-- Name: login_attempts_ipAddress_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "login_attempts_ipAddress_createdAt_idx" ON public.login_attempts USING btree ("ipAddress", "createdAt");


--
-- Name: login_attempts_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "login_attempts_userId_idx" ON public.login_attempts USING btree ("userId");


--
-- Name: sessions_sessionToken_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sessions_sessionToken_idx" ON public.sessions USING btree ("sessionToken");


--
-- Name: sessions_sessionToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");


--
-- Name: sessions_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "sessions_userId_idx" ON public.sessions USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: Address Address_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Attribute Attribute_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attribute"
    ADD CONSTRAINT "Attribute_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."AttributeGroup"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CartItem CartItem_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public."Cart"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Category Category_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Category"(id);


--
-- Name: Favorite Favorite_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Favorite Favorite_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Favorite"
    ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Invoice Invoice_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MediaFile MediaFile_mediaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MediaFile"
    ADD CONSTRAINT "MediaFile_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES public."Media"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductMedia ProductMedia_mediaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductMedia"
    ADD CONSTRAINT "ProductMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES public."Media"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductMedia ProductMedia_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductMedia"
    ADD CONSTRAINT "ProductMedia_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."ProductGroup"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _AttributeToMedia _AttributeToMedia_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_AttributeToMedia"
    ADD CONSTRAINT "_AttributeToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES public."Attribute"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _AttributeToMedia _AttributeToMedia_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_AttributeToMedia"
    ADD CONSTRAINT "_AttributeToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES public."Media"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BrandToMedia _BrandToMedia_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BrandToMedia"
    ADD CONSTRAINT "_BrandToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _BrandToMedia _BrandToMedia_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_BrandToMedia"
    ADD CONSTRAINT "_BrandToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES public."Media"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CategoryToMedia _CategoryToMedia_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CategoryToMedia"
    ADD CONSTRAINT "_CategoryToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CategoryToMedia _CategoryToMedia_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_CategoryToMedia"
    ADD CONSTRAINT "_CategoryToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES public."Media"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductAttribute _ProductAttribute_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductAttribute"
    ADD CONSTRAINT "_ProductAttribute_A_fkey" FOREIGN KEY ("A") REFERENCES public."Attribute"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductAttribute _ProductAttribute_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductAttribute"
    ADD CONSTRAINT "_ProductAttribute_B_fkey" FOREIGN KEY ("B") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductToBrand _ProductToBrand_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductToBrand"
    ADD CONSTRAINT "_ProductToBrand_A_fkey" FOREIGN KEY ("A") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductToBrand _ProductToBrand_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductToBrand"
    ADD CONSTRAINT "_ProductToBrand_B_fkey" FOREIGN KEY ("B") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductToCategory _ProductToCategory_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductToCategory"
    ADD CONSTRAINT "_ProductToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ProductToCategory _ProductToCategory_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_ProductToCategory"
    ADD CONSTRAINT "_ProductToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: accounts accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: comments comments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: login_attempts login_attempts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_attempts
    ADD CONSTRAINT "login_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict pHrEhYAjJxps3GW04asgNfxGFNk2fISvcMP7cYH6c672IG4yh9SyeeaIVuWqxQF


-- Create tables for all Norwegian municipalities grouped by county
create table if not exists brreg_fylker (
  nr text primary key,
  navn text not null,
  sortering integer default 99
);

create table if not exists brreg_kommuner (
  nr text primary key,
  navn text not null,
  fylke_nr text references brreg_fylker(nr)
);

grant select on brreg_fylker, brreg_kommuner to anon, authenticated;

-- Seed fylker (2024 reform codes + stable legacy codes)
insert into brreg_fylker (nr, navn, sortering) values
  ('03', 'Oslo', 1),
  ('31', 'Østfold', 2),
  ('32', 'Akershus', 3),
  ('33', 'Buskerud', 4),
  ('39', 'Vestfold', 5),
  ('40', 'Telemark', 6),
  ('42', 'Agder', 7),
  ('34', 'Innlandet', 8),
  ('11', 'Rogaland', 9),
  ('46', 'Vestland', 10),
  ('15', 'Møre og Romsdal', 11),
  ('50', 'Trøndelag', 12),
  ('18', 'Nordland', 13),
  ('55', 'Troms', 14),
  ('56', 'Finnmark', 15),
  ('21', 'Svalbard', 16)
on conflict (nr) do update set navn=excluded.navn, sortering=excluded.sortering;

-- Seed alle kommuner med fylketilknytning
insert into brreg_kommuner (nr, navn, fylke_nr) values
-- Oslo
('0301','Oslo','03'),
-- Østfold
('3101','Halden','31'),('3103','Moss','31'),('3105','Sarpsborg','31'),
('3107','Fredrikstad','31'),('3110','Hvaler','31'),('3111','Aremark','31'),
('3112','Marker','31'),('3114','Indre Østfold','31'),('3116','Skiptvet','31'),
('3117','Rakkestad','31'),('3118','Råde','31'),('3119','Våler','31'),
-- Akershus
('3201','Bærum','32'),('3203','Asker','32'),('3205','Lillestrøm','32'),
('3207','Nordre Follo','32'),('3209','Ullensaker','32'),('3212','Nesodden','32'),
('3214','Frogn','32'),('3216','Vestby','32'),('3218','Ås','32'),
('3220','Enebakk','32'),('3222','Lørenskog','32'),('3224','Rælingen','32'),
('3226','Aurskog-Høland','32'),('3228','Nes','32'),('3230','Gjerdrum','32'),
('3232','Nittedal','32'),('3234','Lunner','32'),('3235','Jevnaker','32'),
('3236','Nannestad','32'),('3238','Eidsvoll','32'),('3240','Hurdal','32'),
-- Buskerud
('3301','Drammen','33'),('3303','Kongsberg','33'),('3305','Ringerike','33'),
('3310','Hole','33'),('3312','Flå','33'),('3314','Nesbyen','33'),
('3316','Gol','33'),('3318','Hemsedal','33'),('3320','Ål','33'),
('3322','Hol','33'),('3324','Sigdal','33'),('3326','Krødsherad','33'),
('3328','Modum','33'),('3330','Øvre Eiker','33'),('3332','Lier','33'),
('3334','Numedal','33'),('3336','Nore og Uvdal','33'),
-- Vestfold
('3901','Horten','39'),('3903','Holmestrand','39'),('3905','Tønsberg','39'),
('3907','Sandefjord','39'),('3909','Larvik','39'),('3911','Færder','39'),
-- Telemark
('4001','Porsgrunn','40'),('4003','Skien','40'),('4005','Notodden','40'),
('4010','Siljan','40'),('4012','Bamble','40'),('4014','Kragerø','40'),
('4016','Drangedal','40'),('4018','Nome','40'),('4020','Midt-Telemark','40'),
('4022','Seljord','40'),('4024','Hjartdal','40'),('4026','Tinn','40'),
('4028','Kviteseid','40'),('4030','Nissedal','40'),('4032','Fyresdal','40'),
('4034','Tokke','40'),('4036','Vinje','40'),
-- Agder
('4201','Risør','42'),('4202','Grimstad','42'),('4203','Arendal','42'),
('4204','Kristiansand','42'),('4205','Lindesnes','42'),('4206','Farsund','42'),
('4207','Flekkefjord','42'),('4211','Gjerstad','42'),('4212','Vegårshei','42'),
('4213','Tvedestrand','42'),('4214','Froland','42'),('4215','Lillesand','42'),
('4216','Birkenes','42'),('4217','Åmli','42'),('4218','Iveland','42'),
('4219','Evje og Hornnes','42'),('4220','Bygland','42'),('4221','Valle','42'),
('4222','Bykle','42'),('4223','Vennesla','42'),('4224','Åseral','42'),
('4225','Lyngdal','42'),('4226','Hægebostad','42'),('4227','Kvinesdal','42'),
('4228','Sirdal','42'),
-- Innlandet
('3401','Kongsvinger','34'),('3403','Hamar','34'),('3405','Lillehammer','34'),
('3407','Gjøvik','34'),('3411','Ringsaker','34'),('3412','Løten','34'),
('3413','Stange','34'),('3414','Nord-Odal','34'),('3415','Sør-Odal','34'),
('3416','Eidskog','34'),('3417','Grue','34'),('3418','Åsnes','34'),
('3419','Våler','34'),('3420','Elverum','34'),('3421','Trysil','34'),
('3422','Åmot','34'),('3423','Stor-Elvdal','34'),('3424','Rendalen','34'),
('3425','Engerdal','34'),('3426','Tolga','34'),('3427','Tynset','34'),
('3428','Alvdal','34'),('3429','Folldal','34'),('3430','Os','34'),
('3431','Dovre','34'),('3432','Lesja','34'),('3433','Skjåk','34'),
('3434','Lom','34'),('3435','Vågå','34'),('3436','Nord-Fron','34'),
('3437','Sel','34'),('3438','Sør-Fron','34'),('3439','Ringebu','34'),
('3440','Øyer','34'),('3441','Gausdal','34'),('3442','Østre Toten','34'),
('3443','Vestre Toten','34'),('3444','Gran','34'),('3446','Søndre Land','34'),
('3447','Nordre Land','34'),('3448','Sør-Aurdal','34'),('3449','Etnedal','34'),
('3450','Nord-Aurdal','34'),('3451','Vestre Slidre','34'),('3452','Øystre Slidre','34'),
('3453','Vågå-Lom','34'),
-- Rogaland
('1101','Eigersund','11'),('1103','Stavanger','11'),('1106','Haugesund','11'),
('1108','Sandnes','11'),('1111','Sokndal','11'),('1112','Lund','11'),
('1114','Bjerkreim','11'),('1119','Hå','11'),('1120','Klepp','11'),
('1121','Time','11'),('1122','Gjesdal','11'),('1124','Sola','11'),
('1127','Randaberg','11'),('1130','Strand','11'),('1133','Hjelmeland','11'),
('1134','Suldal','11'),('1135','Sauda','11'),('1144','Kvitsøy','11'),
('1145','Bokn','11'),('1146','Tysvær','11'),('1149','Karmøy','11'),
('1151','Utsira','11'),('1160','Vindafjord','11'),
-- Vestland
('4601','Bergen','46'),('4602','Kinn','46'),('4611','Etne','46'),
('4612','Sunnhordland','46'),('4613','Stord','46'),('4614','Fitjar','46'),
('4615','Tysnes','46'),('4616','Kvinnherad','46'),('4617','Ullensvang','46'),
('4618','Eidfjord','46'),('4619','Ulvik','46'),('4620','Voss','46'),
('4621','Kvam','46'),('4622','Samnanger','46'),('4623','Bjørnafjorden','46'),
('4624','Austevoll','46'),('4625','Øygarden','46'),('4626','Askøy','46'),
('4627','Vaksdal','46'),('4628','Modalen','46'),('4629','Osterøy','46'),
('4630','Alver','46'),('4631','Austrheim','46'),('4632','Fedje','46'),
('4633','Masfjorden','46'),('4634','Gulen','46'),('4635','Solund','46'),
('4636','Hyllestad','46'),('4637','Høyanger','46'),('4638','Vik','46'),
('4639','Sogndal','46'),('4640','Aurland','46'),('4641','Lærdal','46'),
('4642','Årdal','46'),('4643','Luster','46'),('4644','Askvoll','46'),
('4645','Fjaler','46'),('4646','Sunnfjord','46'),('4647','Naustdal','46'),
('4648','Bremanger','46'),('4649','Stad','46'),('4650','Gloppen','46'),
('4651','Stryn','46'),
-- Møre og Romsdal
('1505','Kristiansund','15'),('1506','Molde','15'),('1507','Ålesund','15'),
('1511','Vanylven','15'),('1514','Sande','15'),('1515','Herøy','15'),
('1516','Ulstein','15'),('1517','Hareid','15'),('1520','Ørsta','15'),
('1525','Stranda','15'),('1528','Sykkylven','15'),('1531','Sula','15'),
('1532','Giske','15'),('1535','Vestnes','15'),('1539','Rauma','15'),
('1547','Aukra','15'),('1554','Averøy','15'),('1557','Gjemnes','15'),
('1560','Tingvoll','15'),('1563','Sunndalsøra','15'),('1566','Surnadal','15'),
('1573','Smøla','15'),('1576','Aure','15'),('1577','Volda','15'),
('1578','Fjord','15'),('1579','Hustadvika','15'),
-- Trøndelag
('5001','Trondheim','50'),('5006','Steinkjer','50'),('5007','Namsos','50'),
('5020','Osen','50'),('5021','Oppdal','50'),('5022','Rennebu','50'),
('5025','Røros','50'),('5026','Holtålen','50'),('5027','Midtre Gauldal','50'),
('5028','Melhus','50'),('5029','Skaun','50'),('5031','Malvik','50'),
('5032','Selbu','50'),('5033','Tydal','50'),('5034','Meråker','50'),
('5035','Stjørdal','50'),('5036','Frosta','50'),('5037','Levanger','50'),
('5038','Verdal','50'),('5041','Snåsa','50'),('5042','Lierne','50'),
('5043','Røyrvik','50'),('5044','Namsskogan','50'),('5045','Grong','50'),
('5046','Høylandet','50'),('5047','Overhalla','50'),('5049','Flatanger','50'),
('5052','Leka','50'),('5053','Inderøy','50'),('5054','Indre Fosen','50'),
('5055','Heim','50'),('5056','Hitra','50'),('5057','Ørland','50'),
('5058','Åfjord','50'),('5059','Orkland','50'),('5060','Nærøysund','50'),
('5061','Rindal','50'),
-- Nordland
('1804','Bodø','18'),('1806','Narvik','18'),('1811','Bindal','18'),
('1812','Sømna','18'),('1813','Brønnøy','18'),('1815','Vega','18'),
('1816','Vevelstad','18'),('1818','Herøy','18'),('1820','Alstahaug','18'),
('1822','Leirfjord','18'),('1824','Vefsn','18'),('1825','Grane','18'),
('1826','Hattfjelldal','18'),('1827','Dønna','18'),('1828','Nesna','18'),
('1832','Hemnes','18'),('1833','Rana','18'),('1834','Lurøy','18'),
('1835','Træna','18'),('1836','Rødøy','18'),('1837','Meløy','18'),
('1838','Gildeskål','18'),('1839','Beiarn','18'),('1840','Saltdal','18'),
('1841','Fauske','18'),('1845','Sørfold','18'),('1848','Steigen','18'),
('1851','Lødingen','18'),('1853','Evenes','18'),('1856','Røst','18'),
('1857','Værøy','18'),('1859','Flakstad','18'),('1860','Vestvågøy','18'),
('1865','Vågan','18'),('1866','Hadsel','18'),('1867','Bø','18'),
('1868','Øksnes','18'),('1870','Sortland','18'),('1871','Andøy','18'),
('1875','Hamarøy','18'),
-- Troms
('5501','Tromsø','55'),('5503','Harstad','55'),('5510','Kvæfjord','55'),
('5512','Tjeldsund','55'),('5514','Ibestad','55'),('5516','Gratangen','55'),
('5518','Lavangen','55'),('5520','Bardu','55'),('5522','Salangen','55'),
('5524','Målselv','55'),('5526','Sørreisa','55'),('5528','Dyrøy','55'),
('5530','Senja','55'),('5532','Balsfjord','55'),('5534','Karlsøy','55'),
('5536','Lyngen','55'),('5538','Storfjord','55'),('5540','Kåfjord','55'),
('5542','Skjervøy','55'),('5544','Nordreisa','55'),('5546','Kvænangen','55'),
-- Finnmark
('5601','Alta','56'),('5603','Hammerfest','56'),('5605','Sør-Varanger','56'),
('5607','Vadsø','56'),('5610','Vardø','56'),('5612','Berlevåg','56'),
('5614','Tana','56'),('5616','Nesseby','56'),('5618','Båtsfjord','56'),
('5620','Lebesby','56'),('5622','Gamvik','56'),('5624','Nordkapp','56'),
('5626','Porsanger','56'),('5628','Karasjok','56'),('5630','Kautokeino','56'),
('5632','Loppa','56'),('5634','Hasvik','56'),('5636','Måsøy','56'),
('5638','Kvalsund','56'),
-- Svalbard
('2111','Longyearbyen','21'),('2121','Svalbard','21')
on conflict (nr) do update set navn=excluded.navn, fylke_nr=excluded.fylke_nr;

select count(*) as kommuner from brreg_kommuner;

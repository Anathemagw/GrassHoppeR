/**
 * OData server
 * GrassHoppeR Open Data Project in Poland
 * Copyright (C) 2013 Fundacja Aegis (Aegis Foundation)
 * Authors: Roman Zając
 * Licence: http://www.gnu.org/licenses/gpl-3.0.txt
 */

process.title='odata_server';

require('odata-server');

// model config
var yaml_config = require('node-yaml-config');
var services_config = yaml_config.load(__dirname + '/services.yml');


var Collections = {};

for( var service_key in services_config.services )
{
	var service = services_config.services[service_key];
	var model = service.model;
	model['_updated_at'] = { type: 'Edm.DateTime' };

	$data.Entity.extend(service.typeName, model);

	Collections[service_key] = { type: $data.EntitySet, elementType: service.typeName };
}

$data.EntityContext.extend("oDRepo", Collections);


$data.createODataServer({
	type: oDRepo,
	responseLimit: 1000,
        checkPermission: function(access, user, entitySets, callback){
            if (access & $data.Access.Read){
                callback.success();
            }
            else callback.error('auth fail');
        }
}, '/rest', 52999);



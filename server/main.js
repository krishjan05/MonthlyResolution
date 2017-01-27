import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  var database = new MongoInternals.RemoteCollectionDriver("mongodb://127.0.0.1:3001/meteor");
    Resolutions = new Mongo.Collection("resolutions", { _driver: database });
    Meteor.publish('resolutions', function() {
        return Boxes.find();
    });
});

Meteor.methods({
	'addResolution' (title){
		Resolutions.insert({
			title: title,
			createdAt:  new Date(),
			owner: Meteor.userId()
		});
	},
	'deleteResolution' (id){
		var res = Resolutions.findOne(id);
		if(res.owner !== Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Resolutions.remove(id);
	},
	'updateResolution' (id, checked){
		var res = Resolutions.findOne(id);
		if(res.owner !== Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Resolutions.update(id, {$set: {checked: checked}});
	},
	'setPrivate' (id, private){
		var res = Resolutions.findOne(id);
		if(res.owner !== Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Resolutions.update(id, {$set: {private: private}});
	}
});

Meteor.publish("resolutions", function(){
	return Resolutions.find({
		$or:[
			{ private: {$ne: true}},
			{ owner: this.userId}
		]
	});
});


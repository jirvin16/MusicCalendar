function loadJson() {
    $(document).ready(function() {
	    $.getJSON("items.json", function(json) { //get json from spiders output and parse into dictionary
                var i,j, dateDict = {};
                for(i = 0; i < json.length; i++) {
		    for(j = 0; j < json[i]["venueList"].length; j++) {
                        if(dateDict[json[i]["venueList"][j][0]]) //if the month already exists, add it to the list of events within that month
                            dateDict[json[i]["venueList"][j][0]].push([json[i]["name"].join(), json[i]["venueList"][j][1], 
                                                                       json[i]["venueList"][j][2], json[i]["venueList"][j][3] ]);
                        else dateDict[json[i]["venueList"][j][0]] = [ [json[i]["name"].join(), json[i]["venueList"][j][1], //otherwise create a new month
                                                                      json[i]["venueList"][j][2], json[i]["venueList"][j][3]] ]; 
                    }
                }
                var keys = []; //sorts the dictionary by date
                for(var date in dateDict) {
                    keys.push(date);
                }
                keys.sort();
                sortedDateDict = {};
                for(i = 0; i < keys.length; i++) {
                    sortedDateDict[keys[i]] = dateDict[keys[i]];
                }
	       	eventsArray = [];
	       	var monthDict = {1: "01", 2: "02", 3: "03", 4: "04", 5: "05", 6: "06",
                             7: "07", 8: "08", 9: "09", 10: "10", 11: "11", 12: "12" };
		var dayDict = {"01": 31, "02": 28, "03": 31, "04": 30, "05": 31, "06": 30,
                           "07": 31, "08": 31, "09": 30, "10": 31, "11": 30, "12": 31};
		var d = new Date();
		var n = d.getMonth(); //gets current month
		var m = d.getFullYear(); //gets current year (all four digits)
	       	for(var item in sortedDateDict) {
	       		var month = monthDict[Math.floor(item)]; //get month based on integer value
		    	var day = Math.round((item-Math.floor(item))*(dayDict[month]+1)); //get day based on decimal value
	       		for(var group in sortedDateDict[item]) {
					eventObject = {};
					if(month >= n) { //the event is occuring this year
	       				if(day < 10) eventObject["start"] = m + "-" + month + "-0" + day; //2014-03-04
	       				else eventObject["start"] = m + "-" + month + "-" + day; //2014-03-12
	       			}
	       			else { //the event ic occuring next year
	       				if(day < 10) eventObject["start"] = (m + 1) + "-" + month + "-0" + day; //2015-03-04
	       				else eventObject["start"] = (m + 1) + "-" + month + "-" + day; //2015-03-12
	       			}
	       			eventObject["title"] = sortedDateDict[item][group][0] +"\n" 
	       			+ sortedDateDict[item][group][1] + "\n" 
                    + sortedDateDict[item][group][2].substring(0,sortedDateDict[item][group][2].length-3); //cuts off CA
                    //formatted calendar entry:
                    //Name
                    //Venue
                    //Location
	       			eventObject["venue"] = sortedDateDict[item][group][1]; //venue attribute
	       			eventObject["location"] = sortedDateDict[item][group][2].substring(0,sortedDateDict[item][group][2].length-3); //location attribute
	       			eventObject["url"] = sortedDateDict[item][group][3]; //ticket url attribute
				if(eventObject["venue"] != "") {
				    eventsArray.push(eventObject); //add this event to event array of calendar object
				}
			}
	       	}
		$('#calendar').fullCalendar({ //construct the calendar
		      	events: eventsArray,
			    theme: true,
			    eventTextColor: '#000000',
			    eventBackgroundColor: '#00b2ee',
			eventClick: function(event, element) {

			    if (event.url) { //only make clickable if the url exists
            		    window.open(event.url);
            		    return false;
        		    }
			    
			    //$('#calendar').fullCalendar('updateEvent', event);

			}

		})

    	});
    });
}

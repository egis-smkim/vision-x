/**
 *
 */
var LOG_TRACKER = {
	dataTable:0,
	init:function() {
		LOG_TRACKER.dataTable = $("#logTrackerList").DataTable({
			"columns": [
				{ "width" : "5%", "orderable" : false},
				{ "width" : "10%"},
				{ "width" : "10%"},
				{ "width" : "10%"},
				{ "width" : "45%"},
				{ "width" : "20%"}
			],
			"order": [[ 5, 'desc' ]]
		});

		LOG_TRACKER.dataTable.on( 'order.dt search.dt', function () {
			LOG_TRACKER.dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();

	}
}

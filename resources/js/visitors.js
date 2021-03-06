var Visitors = function () {

    //********************************************************************************//
    //                            Global variables
    //********************************************************************************//
    var $visitsTable = $('#visitsTable');
    var $deviceTypeSelect = $('#deviceType');



    //********************************************************************************//
    //                            Initializations
    //********************************************************************************//

    var initVisitsDatatable = function () {
        $visitsTable.DataTable({
            'processing': true,
            'serverSide': true,
            'pageLength': 10,
            'searching': true,
            'lengthChange': true,
            'bInfo': false,
            'autoWidth': true,
            'columnDefs': [
                {
                    'className': 'dt-center',
                    'targets': '_all',
                },
            ],
            columns: [
                {name: 'id', data: 'id', orderable: true},
                {name: 'user', data: null, orderable: false},
                {name: 'url', data: 'url', orderable: true},
                {name: 'ip', data: 'ip', orderable: true},
                {name: 'country', data: 'country', orderable: true},
                {name: 'device_name', data: 'device_name', orderable: false},
                {name: 'browser', data: 'browser', orderable: true},
                {name: 'created_at', data: 'created_at', orderable: true},
                {name: 'action', data: null, orderable: false},
            ],
            'ajax': {
                url: $visitsTable.data('url'),
                type: 'get',
                dataType: 'json',
                data: function (d) {
                     d.device_type = $deviceTypeSelect.val();
                },
                error: function (error) {
                    toastr.error(error.responseJSON.message);
                },
            },
            'createdRow': function (row, data, index) {
                let date = moment(data.created_at).format('DD-MM-YYYY HH:mm');
                if(data.user) {
                    $('td', row).eq(1).empty().append('<span>' + data.user ? data.user.name : '' + '</span>');
                }
                else {
                    $('td', row).eq(1).empty().append('<span>USER DELETED</span>');
                }
                $('td', row).eq(7).empty().append('<span>' + date + '</span>');
                $('td', row).eq(8).empty().append('<span><i style="cursor: pointer" class="delete fa fa-trash" data-id="' + data.id + '" aria-hidden="true"></i></span>');
            },
        });
    };




    //********************************************************************************//
    //                            Events
    //********************************************************************************//

    var reloadDataTable = function () {
        $visitsTable.DataTable().ajax.reload();
    }


    var onDeleteClick = function () {
        $visitsTable.on("click", ".delete", function (event) {
            let visitId = ($(this).data('id'));
            event.preventDefault();
            $.ajax({
                method: 'DELETE',
                url: deleteVisitUrl.replace('id', visitId),
            }).done(function (data) {
                reloadDataTable();
                toastr.success(data.message);
            }).fail(function (error) {
                toastr.error(error.responseJSON.message);
            });
        });
    }

    var onDeviceTypeChange = function () {
        $deviceTypeSelect.on('change', function (event) {
            event.preventDefault();
            reloadDataTable();
        });
    }


    return {
        init: function () {
            initVisitsDatatable();
            onDeleteClick();
            onDeviceTypeChange();
        },
    };
}();

window.addEventListener('load', function () {
    Visitors.init();
});



function cartInit() {
    var products = $.CestaFeira({
            debug: true
        }).getItems(),
        totalValueTemp = 0,
        $cartItems = $('#cart-items');    
    if (!products) {
        console.log("No items in cart!");
        $('#cart-empty').show();
        return;
    }

    function updateTotalValue() {

        var totalValue = 0;

        $.each($('[data-item-total-value]'), function(index, item) {
            totalValue += $(item).data('item-total-value');
        });

        $('#total-value').html("Rp " + thousandSeperator(totalValue));
        $('[data-total-value]').attr('data-total-value', totalValue);
    }


    function mountLayout(index, data) {
        var totalValueTemp = parseFloat(data.unit_price) * parseInt(data.quantity);

        var counterLayout = '<div id="counter" data-counter-id="' + index + '" class="input-group">' +
            '<div class="input-group-prepend"><button class="btn btn-dark minus" type="button">-</button></div>' +
            '<input class="count form-control" name="qty" value="' + data.quantity + '">' +
            '<div class="input-group-append"><button class="btn btn-dark plus" type="button">+</button></div>' +
            '</div>';


        var $layout = "<div id='product-" + index + "' class='cart-item p-2 rounded border-0 shadow-sm col-12 mb-2'>" +
            "  <div class='row'>" +
            "    <div class='product-image col-sm-2 col-3'><a href=" + data.product_slug + ".html><img class='img-fluid d-block' src='" + data.image_url + "'/></a></div>" +
            "    <div class='col-sm-10 col-9 d-flex'>" +
            "      <div class='row flex-grow-1'>" +
            "        <div class='d-flex flex-column justify-content-center flex-grow-1 col-md-5 col-10 col-lg-11' data-item-ukuran='" + data.ukuran + "' data-item-warna='" + data.warna + "' data-item-name='" + data.product_name + "'>" +
            "          <h5 class='mb-1 content-2'>" + data.product_name + "</h5>" +
            "          <span class='mb-0'>" + emptyToString(data.ukuran) + '  ' + emptyToString(data.warna) + "</span>" +
            "          <span class='unit-price' data-item-price='" + data.unit_price + "' >" +
            "               Rp&nbsp; " + thousandSeperator(data.unit_price) +"/pcs"+
            "          </span>" +
            "        </div>" +
            "        <div class='order-md-4 order-lg-1 d-flex px-0 justify-content-center col-md-1 col-2 align-items-center' style=''><button class='btn-delete btn btn-link btn-lg' data-toggle='modal' data-target='#deleteModal' data-name='"+data.product_name+"' data-index="+index+"><i class='fa fa-fw fa-1x py-1 fa-trash'></i></button>" +
            "      </div>" +
            "      <div class='mt-lg-2 font-weight-bold total-price order-lg-3 d-flex flex-column justify-content-center align-items-lg-end flex-grow-1 col-6 col-md-3 col-lg-8' data-item-total-value='" + totalValueTemp + "'>" +
            "        <span class='d-inline content-3'>Total: </span><strong class='d-inline content-5 font-weight-bold'>Rp&nbsp;" + thousandSeperator(totalValueTemp)+"</strong>"+
            "      </div>" +            
            "      <div class='mt-lg-2 counter-layout order-lg-2 d-flex justify-content-center align-items-center col-6 col-md-3 col-lg-4' style=''>" + counterLayout +
            "      </div>" +
            "    </div>" +
            "  </div>" +
            "</div>" +
            "</div>";



        $cartItems.append($layout);
    }



    $.each(products, function(index, value) {
        mountLayout(index, value);
        $('#cart-empty').hide();

    });

    updateTotalValue();

    $(document).on('click', '[data-cesta-feira-delete-item]', function(e) {
        e.preventDefault();

        var productId = $(this).data('cesta-feira-delete-item');

        if ($(document).on('cesta-feira-item-deleted')) {
            $('#product-' + productId).fadeOut(500, function() {
                $(this).remove();
                updateTotalValue();
            });
        }

        if (isObjEmpty($.CestaFeira().getItems())){
            $('#cart-empty').show();
        }

    });

    // $(document).on('cesta-feira-clear-basket', function(e) {
    //     $('#cart-items tr').each(function(index, value) {
    //         $(value).fadeOut(500, function() {
    //             $(this).remove();
    //             updateTotalValue();
    //         });
    //     });
    // });

}


function updatePrices(dom, count_val) {
    var p_id = $(dom).parent().parent().attr('data-counter-id');
    var p_id_dom = '#product-' + p_id;
    var p_u_price_dom = p_id_dom + ' .unit-price';
    var p_u_price_val = parseInt($(p_u_price_dom).attr('data-item-price'));

    var p_t_price_dom = p_id_dom + ' .total-price';
    var p_t_price_val = count_val * p_u_price_val;

    $(p_t_price_dom).attr('data-item-total-value', p_t_price_val);
    $(p_t_price_dom + ' strong').html('Rp ' + thousandSeperator(p_t_price_val));

    // console.log('Harga Unit: '+ p_u_price_val);
    // console.log('Harga Total: '+ p_t_price_val);

    $.CestaFeira().setItem(p_id, 'quantity', '' + count_val);
}

function updateTotalPrice() {
    var totalValue = 0;

    $.each($('[data-item-total-value]'), function(index, item) {
        totalValue += parseInt($(item).attr('data-item-total-value'));
    });
    $('#total-value').html("Rp " + thousandSeperator(totalValue));
    $('[data-total-value]').attr('data-total-value', totalValue);
}



$(document).ready(function() {
    cartInit();
    $('.count').prop('disabled', true);
    $(document).on('click', '.plus', function() {
        var count = $(this).parent().prev('input');
        var count_val = parseInt(count.val());
        count_val = count_val + 1
        count.val(count_val);
        updatePrices(this, count_val);
        updateTotalPrice();
    });
    $(document).on('click', '.minus', function() {
        var count = $(this).parent().next('input');
        var count_val = parseInt(count.val());
        count_val = count_val - 1;
        count.val(count_val);

        if (count.val() == 0) {
            count_val = 1;
            count.val(1);
        }
        updatePrices(this, count_val);
        updateTotalPrice();
    });

    $(document).on('click', '[data-cesta-feira-delete-item]', function(e) {
        updateTotalPrice();
    });

    $('#buy-button-wa').on('click', function() {
        var wa_product = {};
        var wa_products = {};
        var urlLengkap = url;
        var fb_contents = [];
        var fb_content = {};
        $('.cart-item').each(function(index) {
            var pilihanWarna = $(this).find('[data-item-warna]').attr('data-item-warna');
            var pilihanUkuran = $(this).find('[data-item-ukuran]').attr('data-item-ukuran');
            if (isEmpty(pilihanWarna)) { urlWarna = '' } else {
                urlWarna = '%0aWarna: ' + pilihanWarna;
            };

            if (isEmpty(pilihanUkuran)) { urlUkuran = '' } else {
                urlUkuran = '%0aUkuran: ' + pilihanUkuran;
            };

            urlNama = '%0aNama: ' + $(this).find('[data-item-name]').attr('data-item-name');
            urlQty = '%0aJumlah: ' + $(this).find('.count').val();
            urlValue = '%0aHarga: Rp ' + thousandSeperator($(this).find('[data-item-total-value]').attr('data-item-total-value'));
            urlProduk = urlNama + urlWarna + urlUkuran + urlQty + urlValue + '%0a';
            urlLengkap += urlProduk;
            // console.log(urlNama+urlWarna+urlUkuran+urlQty+urlValue);
            fb_content = {
                id: slugify($(this).find('[data-item-name]').attr('data-item-name')),
                quantity: $(this).find('.count').val(),
                size: emptyToString(pilihanUkuran),
                color: emptyToString(pilihanWarna),
            };
            fb_contents.push(fb_content);


        });
        hargaTotal = $('[data-total-value]').attr('data-total-value');
        urlTotal = '%0a---------%0aTotal (belum termasuk ongkir): *Rp ' + thousandSeperator($('[data-total-value]').attr('data-total-value')) + '*';
        urlLengkap += urlTotal;
        urlLengkap = urlLengkap.replace(/&nbsp;/g, ' ');

        fbq('track', 'Purchase', {
                value: hargaTotal,
                currency: 'IDR',
                contents: fb_contents,
            });
        //console.log(fb_contents);
        $.jStorage.set('waURL', urlLengkap);
            // console.log(urlLengkap);
            // window.open('/purchase.html');
        window.location.href = '/purchase.html';
        // window.open(urlLengkap);
    });

    $('.btn-delete').click(function(event) {
        var deleteProductID = $(this).attr('data-index');
        var deleteProductName = $(this).attr('data-name');
        $('#delete-button').data('cesta-feira-delete-item',deleteProductID);
        $('#delete-name').html(deleteProductName);
    });
    $('#delete-button').click(function(event) {
        $('#deleteModal').modal('hide');
    });
});
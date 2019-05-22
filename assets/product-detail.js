




var products;
var current_qty;
var chosen_qty = 1;

function changePrice(price) {
    $('#product-price-hidden').val(price);
    $('#product-price').attr('price', price);
    $('#product-price').html('Rp&nbsp;' + thousandSeperator(price));
    $('#harga-label').html('Rp&nbsp;' + thousandSeperator(price));
    console.log('price changed to:' + $('#product-price-hidden').val());
}

function inputPlusMinus(dom) {
    $(document).on('click', '.plus', function() {
        var count = $(this).parent().prev('input');
        var count_val = parseInt(count.val());
        count_val = count_val + 1
        count.val(count_val);
        if (!isEmpty(dom)) {
            dom.html(count.val());
        }
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
        if (!isEmpty(dom)) {
            dom.html(count.val());
        }
    });
};






function mountLayout(dom, data) {
    $dom = dom;

    var totalValueTemp = parseFloat(data.unit_price) * parseInt(data.quantity);


    var $layout = 
        "<div id='product' class='cart-item p-0 py-1 p-md-2 rounded border-0 col-12 m-0'>" +
        "  <div class='row mx-0'>" +
        "    <div class='product-image col-3'><a href=" + data.product_slug + "><img class='img-fluid d-block' src='" + data.image_url + "'/></a></div>" +
        "    <div class='col-8 d-flex'>" +
        "      <div class='row flex-grow-1'>" +
        "        <div class='d-flex flex-column justify-content-center flex-grow-1 col-12' data-item-ukuran='" + data.ukuran + "' data-item-warna='" + data.warna + "' data-item-name='" + data.product_name + "'>" +
        "          <h6 class='mb-1 content-5'>" + data.product_name + "</h6>" +
        "          <span class='mb-0 content-4'>" + emptyToString(data.ukuran) + '  ' + emptyToString(data.warna) + "</span>" +
        "        </div>" +
        "        <div class='unit-price col-12 d-flex flex-column justify-content-center flex-grow-1' data-item-price='" + data.unit_price + "' >" +
        "         <span class='mb-0 content-4'>Harga: Rp " + thousandSeperator(data.unit_price) + "</span>" +
        "        </div>" +
        "        <div class='quantity col-12 d-flex flex-column justify-content-center flex-grow-1' style=''>" +
        "         <span class='mb-0 content-4'> Jumlah: " + data.quantity + "</span>" +
        "        </div>" +
        "        <div class='total-price col-12 d-flex flex-column justify-content-center flex-grow-1' data-item-total-value='" + totalValueTemp + "'>" +
        "         <span class='mb-0 content-4'>Total: Rp " + thousandSeperator(totalValueTemp) + "</span>" +
        "        </div>" +
        "      </div>" +
        "    </div>" +
        "    <div class='d-flex col p-0'>" +
        "      <button data-toggle='modal' data-target='#deleteModal' data-index="+ $('#product-id').val() +" class='p-0 btn btn-block btn-light shadow-none fa fa-lg fa-trash'><span class='sr-only'>Remove</span></button>" +
        "    </div>" +
        "  </div>" +
        "</div>";




    $dom.html($layout);
}

$(document).ready(function() {
    

    // Instantiate EasyZoom instances
var $easyzoom = $('.easyzoom').easyZoom();

// Get an instance API
var api = $easyzoom.data('easyZoom');
    



    products = $.CestaFeira().getItems();


    inputPlusMinus($('#quantity-label'));
    
    var urlProduk = '%0aProduk: ' + page_nama;
    var urlWarna = '';
    var urlUkuran = '';
    var urlTotal = '';

    $("form").on("change", function(e) {
        var ukuranPilihan = emptyToString('' + $('#ukuran').children("option:selected").val());
        var warnaPilihan = emptyToString('' + $('#warna').children("option:selected").val());
        var ukuranSlug = slugify(ukuranPilihan);
        var warnaSlug = slugify(warnaPilihan);

        var idolo = page_slug + '_' + ukuranSlug + '_' + warnaSlug;

        $('#product-id').val(idolo);
        var id = $('#product-id').val();
        console.log($('#product-id').val());

        //Ukuran & Warna Mobile Label
        var divider = '';

        if (ukuranPilihan != '') { divider = '/' };
        $('#ukuran-label').html(ukuranPilihan);
        $('#warna-label').html(divider + warnaPilihan);
    });

    $("select").on("change", function(e) {
        if (variations) {
            var result = '';
            var warnaPilihan = $('#warna').children("option:selected").val();
            var ukuranPilihan = $('#ukuran').children("option:selected").val();

            $.each(variations, function(variation, price) {
                if (warnaPilihan == variation || ukuranPilihan == variation) {
                    changePrice(price);
                    return false;
                } else {
                    changePrice(normal_price);
                }
            });
        };
    });

    

    // $("#buy_button_wa").on("click", function() {
    //     $(document).on('submit', 'form[data-cesta-feira-form]', function() {
    //         var ukuranPilihan = $('#ukuran').children("option:selected").val();
    //         var warnaPilihan = $('#warna').children("option:selected").val();
    //         var qtyPilihan = parseInt($('#quantity').val());
    //         var harga = parseInt($('#product-price').attr('price'));
    //         var hargaTotal = harga * qtyPilihan;
    //         if (warnaPilihan) {
    //             urlWarna = '%0aWarna: ' + warnaPilihan;
    //         }
    //         if (ukuranPilihan) {
    //             urlUkuran = '%0aUkuran: ' + ukuranPilihan;
    //         }
    //         urlQty = '%0aJumlah: ' + qtyPilihan;
    //         urlHarga = '%0aHarga: *Rp ' + thousandSeperator(hargaTotal) + '*';
    //         urlLengkap = url + urlProduk + urlWarna + urlUkuran + urlTotal + urlQty + urlHarga;
    //         // console.log(url+urlProduk+urlWarna+urlUkuran+urlTotal+urlQty+urlHarga);
    //         window.location.href = urlLengkap;
    //     });
    // });

    function goToWhatsApp() {



            var ukuranPilihan = $('#ukuran').children("option:selected").val();
            var warnaPilihan = $('#warna').children("option:selected").val();
            var qtyPilihan = parseInt($('#quantity').val());
            var harga = parseInt($('#product-price').attr('price'));
            var hargaTotal = harga * qtyPilihan;
            if (warnaPilihan) {
                urlWarna = '%0aWarna: ' + warnaPilihan;
            }
            if (ukuranPilihan) {
                urlUkuran = '%0aUkuran: ' + ukuranPilihan;
            }
            urlQty = '%0aJumlah: ' + qtyPilihan;
            urlHarga = '%0aHarga: *Rp ' + thousandSeperator(hargaTotal) + '*';
            urlLengkap = url + urlProduk + urlWarna + urlUkuran + urlTotal + urlQty + urlHarga;
            urlLengkap = urlLengkap.replace(/&nbsp;/g, ' ');
            // console.log(url+urlProduk+urlWarna+urlUkuran+urlTotal+urlQty+urlHarga);

            fbq('track', 'Purchase', {
                value: hargaTotal,
                currency: 'IDR',
                contents: [
                    {
                        id: page_slug,
                        quantity: qtyPilihan,
                        unit_price: harga,
                        size: emptyToString(ukuranPilihan),
                        color: emptyToString(warnaPilihan)
                    }
                    ],
            });

            $.jStorage.set('waURL', urlLengkap);
            // console.log(urlLengkap);
            // window.open('/purchase.html');
            window.location.href = '/purchase.html';
    };

    function openSuccessModal(){
            var addedProductID = $('#product-id').val();
            var addedProduct = $.CestaFeira().getItems()[addedProductID]
            chosen_qty = parseInt($('#quantity').val());
            addedProduct.quantity = chosen_qty;
            console.log('Quantity:' + addedProduct.quantity);
            $addedProductDOM = $('#added-product');
            mountLayout($addedProductDOM, addedProduct);

            // console.log('value:'+addedProduct.unit_price);
            // console.log('quantity:'+chosen_qty);
            // console.log('size:'+emptyToString(addedProduct.ukuran));
            // console.log('color:'+emptyToString(addedProduct.warna));


            fbq('track', 'AddToCart', {
                value: (parseInt(addedProduct.unit_price)*parseInt(chosen_qty)),
                currency: 'IDR',
                contents: [
                    {
                        id: page_slug,
                        quantity: chosen_qty,
                        unit_price: parseInt(addedProduct.unit_price),
                        size: emptyToString(addedProduct.ukuran),
                        color: emptyToString(addedProduct.warna)
                    }
                    ],
            });
            //setting deleteModal button to delete current item
            $('#delete-button').attr('data-cesta-feira-delete-item',addedProductID);
            $('.delete-name').html(addedProduct.product_name)
            
            $('#cartSuccessModal').modal();
    };
    var main_form = $("form[data-cesta-feira-form]");
    main_form.validate({
          debug: true
    });

    $('.buy_button_wa').click(function(event) { 
        if (main_form.valid()) {
            goToWhatsApp();
        } else {
            // alert('Error '+main_form.valid());
        }
        
    });


    $('[data-cesta-feira-form]').submit(function() {
        products = $.CestaFeira().getItems();
        var product = products[$('#product-id').val()];
        current_qty, chosen_qty;
        if (product) {
            current_qty = parseInt(product.quantity);
            chosen_qty = parseInt($('#quantity').val());
            console.log('current= ' + current_qty);
            console.log('chosen= ' + chosen_qty);
            total_qty = current_qty + chosen_qty;
            $('#quantity').val(total_qty);
            console.log('total= ' + total_qty);

        } 
        return true; // return false to cancel form action
    });

    $(document).on('submit', 'form[data-cesta-feira-form]', function(e) {
        openSuccessModal();
        $('#quantity').val(1);
    });

    $('#delete-button').click(function(event) {
        $('#deleteModal').modal('hide');
        $('#cartSuccessModal').modal('hide');
    });


    function hideCollapse(x) {
        if (x.matches) { // If media query matches
            $('.accordian .collapse').removeClass('show');
            $('.accordian .collapse h1:nth-of-type(1)').hide();
        } else {
            $('.accordian .collapse').addClass('show');
            $('.accordian .collapse h1:nth-of-type(1)').show();
        }
    };


    var sm = window.matchMedia("(max-width: 768px)");
    var md = window.matchMedia("(min-width: 768px)");
    hideCollapse(sm);
    //showCollapse(md); // Call listener function at run time
    sm.addListener(hideCollapse);
    //md.addListener(showCollapse) ;// Attach listener function on state changes 
    function scrollFunction() {

      var topofDiv = $("#product-excerpt").offset().top; //gets offset of header
      var height = $("#product-button").outerHeight();
    
      if ($('body').scrollTop() > (topofDiv)) {
        document.getElementById("product-button-mobile").style.bottom = "0";
      } else {
        document.getElementById("product-button-mobile").style.bottom = "-150px";
      }
    }

    // $('#cartSuccessModal').modal('show');

    $('body').scroll(function() {
      scrollFunction();
    });
});


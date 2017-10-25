    $(document).ready(function() {
        /* initialize */

        $('body').addClass('shown');

        $('main a').not( "#bios a" ).attr('target', '_blank');

        /* random  beteen 1 and 3 */
        var rand = Math.floor(Math.random() * 3);

        $('.cycle-slideshow').each(function(){
            var howMany = $(this).find('p').length;
            $(this).find('.cycle-pager').append('<i class="h3 cycle-pager-active2"> /'+howMany+'</i>');
        });

        $('#cartToggle').on('click', function(){
            toggleCart();
        });


        function toggleCart(){
            $('.shopify-buy-cart-wrapper').addClass('open');
        }

        /* homepage slider */
        // $('#slick').slick({
        //     autoplay: true,
        //     arrows: false,
        //     lazyLoad: 'progressive',
        //     speed: 1000,
        //     fade: true,
        //     cssEase: 'linear',
        //     initialSlide: rand,
        //     mobileFirst: true,
        //     pauseOnFocus: false,
        //     pauseOnHover: false
        // });

        /* hilight active page */
        $('.nav-item a').each(function() {
            // console.log($(this).attr('class'));
            if ($('body').hasClass($(this).attr('class'))) {
                $(this).addClass('active');
            }
        });

        $('#menuExpand').on('click', function(e) {
            $(this).toggleClass('is-active');
            $('.navigation').toggleClass('open');
            appendOnMenuExpand();

            e.preventDefault;
        });

        $('#menuCollapse').on('click', function(){
            $('.navigation').removeClass('open');
            appendOnMenuCollpase();

        });


        var groups = [];
        var products = [];

        var client = ShopifyBuy.buildClient({
          domain: 'tkrg.myshopify.com',
          apiKey: '2c999f822a677ec28e0223c1cb71f21a',
          appId: '6'
        });  

        var ui = ShopifyBuy.UI.init(client);

        var cart;
        var cartLineItemCount;

        client.createCart().then(function (newCart) {
          cart = newCart;
          localStorage.setItem('lastCartId', cart.id);
          cartLineItemCount = 0;
        });


        // console.log('localStorage.getItem(\'lastCartId\'): ', localStorage.getItem('lastCartId'));
        // console.log('cart (outside promise): ', cart);
        // console.log('cartLineItemCount (outside promise): ', cartLineItemCount);

        // console.log(client);



        axios.get('/json/groups.json')
            .then(function(response) {
                buildGroups(response);
            })
            .catch(function(error) {
                console.log(error);
            });

        function buildGroups(json) {
            //console.log('GROUPS: ', json.data);
            json.data.sort( function(a, b){
                return a.order - b.order;
            });
            json.data.forEach(function(e) {
                if (e.collection == 'groups') {
                    // console.log(e.title);                    
                    e["clicked"] = false;
                    e["notes"] = false;
                    e["shopify_id"] = 0;
                    groups.push(e);
                }
            });
            //console.log('FILTERED GROUPS: ', groups);
        }

        axios.get('/json/products.json')
            .then(function(response) {
                buildProducts(response);
            })
            .catch(function(error) {
                console.log(error);
            });

        function buildProducts(json) {
            json.data.sort( function(a, b){
                return a.order - b.order;
            });   
            //console.log('PRODUCTS: ', json.data);
            json.data.forEach(function(e) {
                if (e.collection == 'products') {
                    // console.log(e.title);                    
                    e["clicked"] = false;
                    products.push(e);
                }
            });
            //console.log('FILTERED PRODUCTS: ', products);

        }

        if ($('#groups').length > 0) {

            var groupApp = new Vue({
                delimiters: ['((', '))'],
                el: '#groups',
                data: {
                    groups: groups,
                    products: products
                },
                methods: {
                    showOrigins: function(group) {
                        groupApp.groups.forEach(function(g) {
                          g.clicked = false;
                        })
                        group.clicked = true;
                    },
                    selectProduct: function(product, group) {
                        if (product.image) {
                         group.image = product.image;   
                        }
                        //console.log(product);
                        group.teaser = product.contents;
                        group.shopify_id = product.shopify_id;
                        group.notes = product.tasting_notes;
                        group.clicked = false;
                        groupApp.products.forEach(function(p) {
                          p.clicked = false;
                        })

                        if (product.shopify_id) {

                            this.$nextTick(function () {
                                //console.log(ui);
                                ui.createComponent('product', {
                                    id: product.shopify_id,
                                    node: document.getElementById('p-'+product.shopify_id),
                                    options: {
                                        "product": {
                                            "iframe": false,
                                            "contents": {
                                            "img": false,
                                              "imgWithCarousel": false,
                                              "title": false,
                                              "variantTitle": false,
                                              "price": true,
                                              "description": false,
                                              "buttonWithQuantity": false,
                                              "quantity": false,
                                            }
                                        },
                                    }
                                }).then(function(result){
                                    $(result.node).find('.shopify-buy__btn').text("Add to cart");
                                    $(result.node).find('.shopify-buy__btn').on('click', function(){
                                        $(result.cart.node).addClass('open');
                                    });
                                });       
                                // console.log(this.$el.textContent) // => 'updated'
                            })
                        }
                        product.clicked = true;
                    },
                    initShopify: function(product, group) {
                        console.log(product, group);
                    },                
                    makeImage: function(val){
                    return '//res.cloudinary.com/fiveten/image/upload/c_scale,q_auto:good,w_1500/'+val.image+'.jpg';
                    },
                    addToCart: function(productId, elementId, varId) {                  


                    }
                }
            });


        }


var last_known_scroll_position = 0;
var last_known_screen_size = 0;
var ticking = false;

function swapLogo(scroll_pos) {

    if(scroll_pos >= 16) {
        $('img.logo').attr('src', '/images/logo-mobile.svg').addClass('small');
    } else {
        $('img.logo').attr('src', '/images/logo.svg').removeClass('small');
    }
  
}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function() {
      swapLogo(last_known_scroll_position);
      ticking = false;
    });
  }
  ticking = true;
});


function initExpander() {
  $('.expander').on('click', function(){
    if ($(this).parent().hasClass('open')) {
        $(this).parent().removeClass('open');
    } else {
        $(this).parent().addClass('open');
    }    
  });
}

initExpander();




$('.expand-person').on('click', function(e){
    var idx = $(this).parent().data('index'); 
    $('#people').css('display', 'none');
    $('#bios').css('display', 'block');
    $('.bio').css('display', 'none');
    $('#bio-'+idx).css('display', 'block');
    e.preventDefault();

    // console.log(idx);
});

$('.bio-nav a').on('click', function(e){
    var idx = $(this).data('index'); 
    $('#people').css('display', 'none');
    $('#bios').css('display', 'block');
    $('.bio').css('display', 'none');
    $('#bio-'+idx).css('display', 'block');
    e.preventDefault();
    // console.log(idx);
});


$('.pre-teaser-mobile').on('click', function() {
    $(this).next().addClass('open');
});
$('.panels .close').on('click', function() {
    $(this).parent().removeClass('open');
});

$('.expand-mobile').on('click', function() {
    $(this).next().addClass('open');
    $(this).parent().find('.p1').hide();
});

ui.createComponent('product', {
    id: 11603497556,
    node: document.getElementById('hidden'),
    options: {
        "product": {
            "iframe": false,
            "contents": {
            "img": false,
              "imgWithCarousel": false,
              "title": false,
              "variantTitle": false,
              "price": true,
              "description": false,
              "buttonWithQuantity": false,
              "quantity": false,
            }
        },

      cart: {
        iframe: false,
        // templates: cartTemplates,
        startOpen: true,
        popup: true,
        manifest: ['cart', 'lineItem', 'toggle'],
        contents: {
          title: true,
          lineItems: true,
          footer: true,
        },
        order: ['title', 'lineItems', 'footer'],
        classes: {

        },
        text: {
          title: 'My Bag',
          empty: 'Your bag is empty.',
          button: 'CHECKOUT',
          total: 'SUBTOTAL',
          currency: 'CAD',
          notice: 'Shipping and discount codes are added at checkout.',
        },  
      },
    }
}).then(function(result){
    $(result.cart.node).find('.shopify-buy__btn--close').on('click', function(){
        $('.shopify-buy-cart-wrapper').removeClass('open');
        $('#cartCount').html(getCartQuantity());
    });   
    // $(result.cart.node).find('.shopify-buy__cart-bottom').prepend("HEY")
 
});  

function getCartQuantity() {
  if (localStorage['references.tkrg.myshopify.com.recent-cart']) {
    var total = 0
    var localShopReference = JSON.parse(localStorage['references.tkrg.myshopify.com.recent-cart'])
    var localShopReferenceID = localShopReference.referenceId
    var shop = JSON.parse(localStorage['carts.' + localShopReferenceID])

    shop.cart.line_items.forEach(function(e, i) {
      total = total + e.quantity
    })
    
    return total
  } else {
    return 0
  }
}

//console.log(getCartQuantity());

$('#cartCount').append(getCartQuantity());


$(window).resize(function(){
    appendOnResize();
});

appendOnResize();

function appendOnResize(){
    if($(window).width() < 769)
    {
        //Mobile
        $("#mc-embedded-subscribe-form").insertAfter("#newsletter-2 .append-to-me");
    }
    else
    {
        $("#mc-embedded-subscribe-form").insertAfter("#newsletter-1 .append-to-me");        
    }
}

function appendOnMenuExpand(){
        $("#mc-embedded-subscribe-form").insertAfter("#newsletter-3 .append-to-me");
}
function appendOnMenuCollpase(){
        $("#mc-embedded-subscribe-form").insertAfter("#newsletter-2 .append-to-me");    
}



        /* end initialize */
    });
    $(document).ready(function() {
        /* initialize */

        $('body').addClass('shown');

        /* random  beteen 1 and 3 */
        var rand = Math.floor(Math.random() * 3);

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


        /* end initialize */
    });
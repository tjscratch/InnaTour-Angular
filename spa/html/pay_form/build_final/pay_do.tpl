{% assign var="file" value=$smarty.template %}
{% php %}
    $file = $this->get_template_vars('file');
    $path = explode("/",dirname($file));
    $this->assign('template_dir', dirname($file));
    $this->assign('custom', '/custom/'.end($path));
{% /php %}

{% capture name="title" %}{% strip %}
    {% ic %}Оплата банковской картой{% /ic %}
{% /strip %}{% /capture %}

{% capture name="js" %}{% strip %}
    <script type="text/javascript" src="{% $custom %}/js/libs.js"></script>
    <script type="text/javascript" src="{% $custom %}/js/app.js"></script>
{% /strip %}{% /capture %}

{% capture name="body" %}
    <div class="pay-form__title">
        Заказ №{%* $context.Order_IDP *%}
    </div>
    <form novalidate name="paymentForm" id="frmRedirect" action="{% $url|escape %}" method="post">
        <input type="hidden" name="context" value="{% $contextSerialized|escape %}" />
        <div class="pay-form-fields">
            <div class="load">
                Подождите, пожалуйста.<br/>
                Идет авторизация Вашего платежа
            </div>
        </div>
        <div class="pay-form-actions">

            <div class="pay-form__price">
                <div class="pay-form__price-label">Сумма к оплате</div>
                <div class="pay-form__price-value gray">{%* $context.Subtotal_P *%} <span class="ruble">c</span></div>
            </div>

            <div class="pay-form-actions__btn">
                <input
                        type="submit"
                        class="form-btn background-gray"
                        value="Оплатить"
                >
            </div>
        </div>
    </form>
    <script>
       document.getElementById('frmRedirect').submit();
    </script>
{% /capture %}

{% include file="$template_dir/base.tpl"
    title=$smarty.capture.title
    body=$smarty.capture.body
	js=$smarty.capture.js|default:''
%}

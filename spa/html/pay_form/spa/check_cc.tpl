{% assign var="file" value=$smarty.template %}
{% php %}
    $file = $this->get_template_vars('file');
    $this->assign('template_dir', dirname($file));
{% /php %}

{% capture name="title" %}
    Оплата прошла успешно
{% /capture %}

{% capture name="body" %}
    <div id="check">
        {% if !empty($cardRegistrationInfo) %}
        <div id="card_reg_title">{% ic %}{% $cardRegistrationInfo %}{% /ic %}</div>
        {% /if %}
        
        Ваш платеж банковской картой совершен успешно.<br>
        Информация о платеже направлена по указанному адресу электронной почты.<br>
        По всем вопросам, связанным с выполнением оплаченного Вами заказа, пожалуйста, обращайтесь в предприятие e-коммерции "{% $aShop.name %}"



        <form id="payForm" action="{% $conf.currentUrl %}" method="post">

        <fieldset>
            <input type="hidden" name="context" value="{% $contextSerialized|escape %}" />
            <input type="hidden" name="doReturn" value="1" />
            <button class="corner" id="btnBack" tabindex="1" onclick="document.getElementById('payForm').submit(); return true;"><div id="logo_button"></div></button>
        </fieldset>

        </form>

    </div>
{% /capture %}



{% assign var="baseFile" value="$template_dir/base.tpl" %}
{% include file=$baseFile
    title=$smarty.capture.title|default:''
    css=$smarty.capture.css|default:''
    body=$smarty.capture.body|default:''
%}
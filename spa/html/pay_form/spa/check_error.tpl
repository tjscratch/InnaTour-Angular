{% assign var="file" value=$smarty.template %}
{% php %}
    $file = $this->get_template_vars('file');
    $path = explode("/",dirname($file));
    $this->assign('custom', '/custom/'.end($path));
    $this->assign('template_dir', dirname($file));
{% /php %} 

{% capture name="title" %}
    Страница оплаты
{% /capture %}

{% capture name="css" %}
    <link rel="stylesheet" href="{% $custom %}/css/main.css">
    <link rel="stylesheet" href="{% $custom %}/css/error.css">
{% /capture %}

{% capture name="body" %}

{% if isset($message) %}
<!-- MERCHANT ERROR: {% $message %} -->
{% /if %}
<div id="page">
     {% if isset($message) %}
    <div id="header">{% ic %}Ошибка загрузки страницы чека{% /ic %}</div>
    <div id="error_text">
        <p>{% ic %}Платёж совершён, но в процессе формирования чека возникла непредвиденная ошибка.{% /ic %}</p>
        <p>{% ic %}Вся основная информация по оплате будет выслана вам на адрес электронной почты, указанный при оплате.{% /ic %}</p>
        <p>{% ic %}При необходимости обратитесь в Службу технической поддержки компании Uniteller или в техническую поддержку магазина.{% /ic %}</p>
    </div>
    {% /if %}

    {% if !empty($aErrors) %}
    <div id="header">{% ic %}Ошибка оплаты{% /ic %}</div>
        {% assign var="hasNumericKeys" value=false %}
        {% foreach item=item key=key from=$aErrors %}
            {% if is_numeric($key) %}
                {% assign var="hasNumericKeys" value=true %}
            {% /if %}
        {% /foreach %}
        {% if $hasNumericKeys %}
            <div class="error">
                {% foreach item=item key=key from=$aErrors %}
                    {% if is_numeric($key) %}
                        <p>{% ic %}{% $item %}{% /ic %}</p>
                    {% /if %}
                {% /foreach %}
            </div>
        {% /if %}
    {% /if %}

    {% if isset($contextSerialized) %}
    <form id="payForm" method="post" action="{% $conf.currentUrl|escape %}">
        <input type="hidden" name="context" value="{% $contextSerialized|escape %}" readonly>
        <input type="hidden" name="back" id="inputBack" value="1" readonly>
        <div id="error_back">
            <a href="#" onclick="return document.getElementById('payForm').submit();">Вернуться в магазин</a>
        </div>
    </form>
    {% /if %}
    <div class="line"></div>
    <div id="footer_error">
        <p>В случае возникновения вопросов Вы можете обратиться в Службу поддержки компании Uniteller по телефону
        <span id="tel">+7 495 987 19 60</span>
        или электронной почте
        <a href="mailto:support@uniteller.ru">support@uniteller.ru</a>
        </p>
    </div>
</div>
{% /capture %}




{% assign var="baseFile" value="$template_dir/base.tpl" %}
{% include file=$baseFile
    title=$smarty.capture.title|default:''
    css=$smarty.capture.css|default:''
    body=$smarty.capture.body|default:''
%}
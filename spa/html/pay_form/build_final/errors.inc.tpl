{% assign var="file" value=$smarty.template %}
{% php %}
    $file = $this->get_template_vars('file');
    $errors = $this->get_template_vars('aErrors');
    $path = explode("/",dirname($file));
    $this->assign('custom', '/custom/'.end($path));
    $this->assign('template_dir', dirname($file));
{% /php %} 

{% strip %}
{%**
 * @param array $aErrors
 * @params string $id = "" -- если задан, то выводится только сообщение об ошибке к полю $id
 * @param boolean $generalOnly = false -- если установле в true, то показываются только ошибки с числовыми ключами в массиве $aErrors (то есть те, которые не связаны с конкретным полем)
 *%}

{% if !isset($id) %}
    {% assign var="id" value="" %}
{% /if %}
{% if !isset($generalOnly) %}
    {% assign var="generalOnly" value=false %}
{% /if %}

{% if !empty($aErrors) %}
    
    {% if $id != "" %}
        {% if isset($aErrors.$id) %}
            <div class='pay-form__error'>
                <strong>Платеж отклонен</strong>
                <p>{% ic %}{% $aErrors.$id %}{% /ic %}</p>
            </div>
        {% /if %}
    {% elseif $generalOnly %}
        {% assign var="hasNumericKeys" value=false %}
        {% foreach item=item key=key from=$aErrors %}
            {% if is_numeric($key) %}
                {% assign var="hasNumericKeys" value=true %}
            {% /if %}
        {% /foreach %}
        {% if $hasNumericKeys %}
            <div class='pay-form__error'>
                <strong>Платеж отклонен</strong>
                {% foreach item=item key=key from=$aErrors %}
                    {% if is_numeric($key) %}
                        <p>{% ic %}{% $item %}{% /ic %}</p>
                    {% /if %}
                {% /foreach %}
            </div>
        {% /if %}
    {% else %}
        <div class='pay-form__error'>
            <strong>Платеж отклонен</strong>
            {% foreach item=item from=$aErrors %}
                <p>{% ic %}{% $item %}{% /ic %}</p>
            {% /foreach %}
        </div>
    {% /if %}
{% /if %}
{% /strip %}


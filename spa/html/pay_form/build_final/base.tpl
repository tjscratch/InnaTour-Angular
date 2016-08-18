{% php %}
    $file = $this->get_template_vars('file');
    $path = explode("/",dirname($file));
    $this->assign('custom', '/custom/'.end($path));
{% /php %} 
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html ng-app="pay_form">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="initial-scale=1 maximum-scale=1 minimum-scale=1 user-scalable=no" />
    <title>{% $title|default:'' %}</title>

    <link rel="stylesheet" href="{% $custom %}/css/base.css" />
</head>
<body>
    <div class="pay-form" ng-controller="PayFormCtrl">
        {% $body|default:'' %}
    </div>
    
    {% $css|default:'' %}
    {% $js|default:'' %}
</body>

</html>
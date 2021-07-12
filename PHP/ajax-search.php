<!DOCTYPE html>
<html>

<head>
	<title>Ajax search</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
</head>

<body style="background: url(img/background.jpg) no-repeat center center fixed;">

	<hr>
	<div class="container">
		<div class="row">
			<div class="col-sm-7 col-md-8 col-lg-9 col-xl-10 col-7">
				<label style="color: white;" for="search">Поиск по почтовому адресу</label>
				<input type="text" name="search" id="search" placeholder="Поиск" class="form-control">
			</div>
		</div>
	</div>
	<br />
	<div class="container-fluid" id="show"></div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function() {
			$("#search").keyup(function() {
				var search = $("#search").val();
				if ((search == "") || (search.match(/\s/g))) {
					$("#show").html(" ");
				} else {
					$.ajax({
						type: "POST",
						url: "search.php",
						data: {
							"userData": search
						},
						success: function(data) {
							$("#show").html(data);
						}
					});
				}
			});
		});
	</script>
</body>

</html>
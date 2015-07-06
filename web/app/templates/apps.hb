<div class="wiz_panel">
	<h3 class="wiz_panel_header">Pre-Install Apps</h3>
	<p class="wiz_desc">Select the apps you would like to come pre-installed on your cloudstead</p>

	{{#each app in apps}}
	<div class='row wiz_dns_tab'>
		<div class='large-1 columns switch tiny radius'>
			{{input elementId=app.appName type="checkbox" checked=app.isChecked}}
			<label {{bind-attr for=app.appName}}></label>
		</div>
		<div class='large-11 columns'>{{app.appName}}</div>
	</div>
	{{/each}}
</div>

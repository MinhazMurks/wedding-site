import ghPages from 'gh-pages';

ghPages.publish(
	'build',
	{
		branch: 'gh-pages',
		silent: true,
		repo: 'https://' + process.env.GITHUB_TOKEN + '@github.com/MinhazMurks/wedding-site.git',
		nojekyll: true,
	},
	() => {
		console.log('Deploy Complete!')
	}
	);
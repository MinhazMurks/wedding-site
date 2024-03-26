import ghPages from 'gh-pages';

ghPages.publish(
	'.svelte-kit/output/client',
	{
		branch: 'gh-pages',
		silent: true,
		repo: 'https://' + process.env.GITHUB_TOKEN + '@github.com/MinhazMurks/wedding-site.git',
		nojekyll: true,
		user: {
			name: 'Minhaz Abdullah',
			email: 'MinhazMurks+Github@gmail.com'
		}
	},
	() => {
		console.log('Deploy Complete!')
	}
	);
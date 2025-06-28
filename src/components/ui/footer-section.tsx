'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FacebookIcon, Film, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Navigate',
		links: [
			{ title: 'Home', href: '/' },
			{ title: 'Search', href: '/search' },
			{ title: 'Movies', href: '/movies' },
			{ title: 'TV Shows', href: '/tv-shows' },
		],
	},
	{
		label: 'Legal',
		links: [
			{ title: 'Privacy Policy', href: '/privacy' },
			{ title: 'Terms of Service', href: '/terms' },
			{ title: 'DMCA', href: '/dmca' },
			{ title: 'Contact Us', href: '/contact' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Help', href: '/help' },
			{ title: 'About Us', href: '/about' },
			{ title: 'Brand', href: '/brand' },
			{ title: 'Blog', href: '/blog' },
		],
	},
	{
		label: 'Social Links',
		links: [
			{ title: 'Facebook', href: '#', icon: FacebookIcon },
			{ title: 'Instagram', href: '#', icon: InstagramIcon },
			{ title: 'Youtube', href: '#', icon: YoutubeIcon },
			{ title: 'LinkedIn', href: '#', icon: LinkedinIcon },
		],
	},
];

export function Footer() {
	return (
		<footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-white/10 liquid-glass-card px-6 py-12 lg:py-16 mt-20">
			<div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur bg-white/20" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				<AnimatedContainer className="space-y-4">
					<Link to="/" className="flex items-center">
						<div className="relative">
							<Film className="w-8 h-8 text-blue-400" strokeWidth={2} />
							<div className="absolute inset-0 w-8 h-8 bg-blue-500/20 rounded-full blur-lg"></div>
						</div>
						<span className="ml-3 text-2xl font-bold sf-pro-display bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
							MoviesMirror
						</span>
					</Link>
					<p className="text-white/70 text-sm leading-relaxed mb-8 sf-pro-text max-w-md">
						MoviesMirror is your gateway to endless entertainment. Stream the latest movies and TV shows in stunning quality. Experience cinema like never before with our liquid glass interface.
					</p>
					<p className="text-white/50 mt-8 text-sm md:mt-0 sf-pro-text">
						© {new Date().getFullYear()} MoviesMirror. All rights reserved.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-lg font-semibold mb-6 sf-pro-display text-white">{section.label}</h3>
								<ul className="text-white/70 mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											{link.href.startsWith('#') ? (
												<a
													href={link.href}
													className="hover:text-white inline-flex items-center transition-all duration-300 sf-pro-text apple-hover"
												>
													{link.icon && <link.icon className="me-1 w-4 h-4" />}
													{link.title}
												</a>
											) : (
												<Link
													to={link.href}
													className="hover:text-white inline-flex items-center transition-all duration-300 sf-pro-text apple-hover"
												>
													{link.icon && <link.icon className="me-1 w-4 h-4" />}
													{link.title}
												</Link>
											)}
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>

			{/* Additional MoviesMirror specific content */}
			<div className="mt-16 pt-8 border-t border-white/10 text-center w-full">
				<p className="text-xs text-white/50 mb-3 sf-pro-text">
					This is a demo application. Not for commercial use. All media content is sourced through public APIs.
				</p>
				<p className="text-xs text-white/50 mb-4 sf-pro-text">
					Data provided by{' '}
					<a 
						href="https://www.themoviedb.org/" 
						target="_blank" 
						rel="noopener noreferrer" 
						className="text-blue-400 hover:text-blue-300 transition-colors apple-hover"
					>
						The Movie Database (TMDB)
					</a>
				</p>
				<div className="flex items-center justify-center text-white/40">
					<span className="text-xs sf-pro-text mr-2">Made with</span>
					<span className="text-red-400 mx-1">♥</span>
					<span className="text-xs sf-pro-text ml-2">for movie lovers</span>
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { EducationSection } from '@/components/sections/education-section';
import { ServicesSection } from '@/components/sections/services-section';
import { ContactSection } from '@/components/sections/contact-section';
import { MaintenanceView } from '@/components/sections/maintenance-view';
import { ErrorFallback } from '@/components/ui/error-fallback';

import {
  profileService,
  projectsService,
  skillsService,
  educationService,
  experienceService,
  servicesService,
  socialLinksService,
  siteSettingsService,
} from '@/lib/services';

import {
  Profile,
  Project,
  Skill,
  Education,
  Experience,
  Service,
  SocialLink,
  SiteSetting,
} from '@/types';

// Force dynamic server rendering for fresh API data
export const revalidate = 0;

export default async function PortfolioHomePage() {
  let profile: Profile | null = null;
  let siteSettings: SiteSetting | null = null;
  let projects: Project[] = [];
  let projectsTotal: number | undefined = undefined;
  let skills: Skill[] = [];
  let skillsTotal: number | undefined = undefined;
  let education: Education[] = [];
  let experience: Experience[] = [];
  let services: Service[] = [];
  let servicesTotal: number | undefined = undefined;
  let socialLinks: SocialLink[] = [];

  let profileError: string | null = null;

  // Execute all public REST API requests concurrently with resilient error isolation
  const [
    profileRes,
    settingsRes,
    projectsRes,
    skillsRes,
    educationRes,
    experienceRes,
    servicesRes,
    socialRes,
  ] = await Promise.allSettled([
    profileService.getProfile(),
    siteSettingsService.getSiteSettings(),
    projectsService.getProjects(),
    skillsService.getSkills(),
    educationService.getEducation(),
    experienceService.getExperience(),
    servicesService.getServices(),
    socialLinksService.getSocialLinks(),
  ]);

  if (profileRes.status === 'fulfilled') profile = profileRes.value;
  else profileError = profileRes.reason?.message || 'Profile unseeded or unavailable';

  if (settingsRes.status === 'fulfilled') siteSettings = settingsRes.value;

  if (projectsRes.status === 'fulfilled') {
    projects = projectsRes.value.data || [];
    projectsTotal = projectsRes.value.total ?? projects.length;
  }

  if (skillsRes.status === 'fulfilled') {
    skills = skillsRes.value.data || [];
    skillsTotal = skillsRes.value.total ?? skills.length;
  }

  if (educationRes.status === 'fulfilled') {
    education = educationRes.value.data || [];
  }

  if (experienceRes.status === 'fulfilled') {
    experience = experienceRes.value.data || [];
  }

  if (servicesRes.status === 'fulfilled') {
    services = servicesRes.value.data || [];
    servicesTotal = servicesRes.value.total ?? services.length;
  }

  if (socialRes.status === 'fulfilled') {
    socialLinks = socialRes.value.data || [];
  }

  // Maintenance Mode Gatekeeper (strictly when siteSettings is returned successfully AND isMaintenanceMode === true)
  if (siteSettings && siteSettings.isMaintenanceMode === true) {
    return <MaintenanceView siteSettings={siteSettings} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar siteSettings={siteSettings} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {profileError && !profile && (
          <div className="mt-6">
            <ErrorFallback
              title="Profile API Notice"
              message="The Profile dataset is currently unseeded on the backend. Run 'npm run seed:profile' in the backend terminal to populate."
            />
          </div>
        )}

        {/* HERO SECTION */}
        <HeroSection
          profile={profile}
          projectsCount={projectsTotal}
          skillsCount={skillsTotal}
          servicesCount={servicesTotal}
        />

        {/* ABOUT SECTION */}
        <AboutSection profile={profile} />

        {/* SKILLS SECTION */}
        <SkillsSection skills={skills} />

        {/* PROJECTS SECTION */}
        <ProjectsSection projects={projects} />

        {/* EXPERIENCE TIMELINE SECTION */}
        <ExperienceSection experiences={experience} />

        {/* EDUCATION TIMELINE SECTION */}
        <EducationSection educationList={education} />

        {/* SERVICES SECTION */}
        <ServicesSection services={services} />

        {/* CONTACT SECTION */}
        <ContactSection profile={profile} socialLinks={socialLinks} />
      </main>

      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />
    </div>
  );
}

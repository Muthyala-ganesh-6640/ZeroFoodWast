import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, HeartHandshake, Leaf, MapPinned, PackageCheck, Sprout, Truck, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MapPanel from './MapPanel';

const steps = [
  { label: 'Share surplus', detail: 'List fresh, safe food that is ready to be rescued.', icon: UtensilsCrossed },
  { label: 'Find a partner', detail: 'A local community partner accepts your donation.', icon: HeartHandshake },
  { label: 'Move it safely', detail: 'Follow pickup and delivery progress in one place.', icon: Truck },
  { label: 'Feed a community', detail: 'See where your food went and who it helped.', icon: PackageCheck },
];

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalFoodRescued: 0,
    totalMealsServed: 0,
    activeDonors: 0,
    verifiedPartners: 0,
    completedDeliveries: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/public/stats');
        setStats((current) => ({ ...current, ...(response.data || {}) }));
      } catch (error) {
        console.error('Unable to fetch public stats', error);
      }
    };

    fetchStats();
  }, []);

  const impactStats = [
    ['Food rescued', `${stats.totalFoodRescued} kg`],
    ['Meals served', stats.totalMealsServed.toLocaleString()],
    ['Community donors', stats.activeDonors.toLocaleString()],
    ['Verified partners', stats.verifiedPartners.toLocaleString()],
  ];

  return (
    <main className="overflow-hidden bg-[#f8f7ef] text-[#26352c]">
      <section
        className="food-hero relative isolate flex items-center bg-[#273b2a] text-white"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(22, 39, 26, 0.86) 0%, rgba(28, 43, 27, 0.68) 46%, rgba(28, 43, 27, 0.12) 100%), url('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2200&q=90')",
          backgroundPosition: 'center 54%',
          backgroundSize: 'cover',
        }}
      >
        <div className="food-hero-inner pb-20 pt-16 md:pb-24 md:pt-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#e4d5a9]">
              <Sprout className="h-4 w-4" /> Good food. Shared well.
            </p>
            <h1 className="food-hero-title">
              ZeroFoodWaste
            </h1>
            <p className="food-hero-copy">
              Turn surplus into a meal, and a simple donation into a visible act of care for your community.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#e4a94e] px-5 py-3 text-sm font-bold text-[#283a26] transition hover:bg-[#f0bd69]">
                Donate food <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="inline-flex min-h-12 items-center rounded-lg border border-white/60 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
                Join as a partner
              </Link>
            </div>
          </motion.div>
          <a href="#impact" className="mt-12 inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white">
            See our shared impact <ArrowDown className="h-4 w-4" />
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#d79a48]" />
      </section>

      <section id="impact" className="border-b border-[#e3e5d8] bg-[#f8f7ef]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 py-8 md:grid-cols-4 md:px-10 md:py-10">
          {impactStats.map(([label, value], index) => (
            <div key={label} className={`px-3 py-3 md:px-7 ${index > 1 ? 'border-t border-[#e3e5d8] md:border-t-0' : ''} ${index % 2 ? 'border-l border-[#e3e5d8]' : ''} ${index > 1 ? 'md:border-l' : ''}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#738071]">{label}</p>
              <p className="mt-2 text-2xl font-bold text-[#31583a] md:text-3xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#a66d31]">From surplus to support</p>
            <h2 className="font-display mt-3 text-4xl leading-tight text-[#294c31] md:text-5xl">A little coordination goes a long way.</h2>
          </div>
          <p className="max-w-xl pb-1 text-base leading-7 text-[#68746a] md:justify-self-end">
            Donors, delivery partners and local organizations move food through one clear, accountable journey.
          </p>
        </div>
        <div className="mt-12 grid border-y border-[#dfe2d5] sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <motion.article key={step.label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="border-b border-[#dfe2d5] px-4 py-6 sm:px-6 xl:border-b-0 xl:border-r xl:py-8 last:border-r-0">
              <div className="flex items-center justify-between">
                <step.icon className="h-6 w-6 text-[#547547]" />
                <span className="text-sm font-semibold tabular-nums text-[#a0a99b]">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-[#2d4531]">{step.label}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-[#718075]">{step.detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e1e4d7] bg-[#eaeddf]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:px-10 md:py-20">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-[#a66d31]"><Leaf className="h-4 w-4" /> Local action, visible impact</p>
            <h2 className="font-display mt-4 text-4xl leading-tight text-[#294c31] md:text-5xl">Good food deserves a good destination.</h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#667367]">
              Follow donations from the pickup point to a community partner, with delivery updates and distribution proof shared along the way.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#49664a]">
              <span className="inline-flex items-center gap-2"><MapPinned className="h-4 w-4 text-[#b47a3c]" /> Local pickup routes</span>
              <span className="inline-flex items-center gap-2"><PackageCheck className="h-4 w-4 text-[#b47a3c]" /> Verified hand-offs</span>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-[#d9dece] bg-white p-2 shadow-[0_18px_50px_rgba(46,67,43,0.12)]">
            <MapPanel />
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-10 md:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#a66d31]">Be part of the rescue</p>
          <h2 className="font-display mt-2 text-3xl text-[#294c31] md:text-4xl">Let good food keep doing good.</h2>
        </div>
        <Link to="/login" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#31583a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#24452d]">
          Get started <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Fingerprint, Zap } from 'lucide-react';
import { TransformationExtended } from '@/types/transformations';

interface BridgeWidgetProps {
    transformation: TransformationExtended;
    dict: any;
}

export default function BridgeWidget({ transformation, dict }: BridgeWidgetProps) {
    if (!transformation.outfit || transformation.outfit.length === 0) return null;

    // Get the first product (primary source)
    const primaryProduct = transformation.outfit[0];

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-black text-white overflow-hidden border-2 border-accent"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-500 to-transparent pointer-events-none" />

                <div className="flex flex-col md:flex-row">
                    {/* Left: Lab Context */}
                    <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/20">
                        <div className="flex items-center gap-2 text-accent mb-4">
                            <Fingerprint size={20} />
                            <span className="text-xs font-mono uppercase tracking-widest">
                                {dict?.transformation?.related_products || 'DETECTED SOURCE MATERIAL'}
                            </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 leading-tight">
                            {dict?.anime_to_real?.title || 'SIMULATION'} <span className="text-gray-500">vs</span> <span className="text-accent">{dict?.transformation?.from || 'ORIGIN'}</span>
                        </h3>

                        <p className="text-sm text-gray-400 font-mono mb-6 leading-relaxed">
                            This artifact contains the aesthetic DNA used to generate this simulation. Configure this design onto physical substrates to complete the archival loop.
                        </p>

                        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-500">
                            <span className="flex items-center gap-1">
                                <Zap size={12} className="text-yellow-500" />
                                HIGH FIDELITY
                            </span>
                            <span>•</span>
                            <span>ARCHIVAL GRADE A+</span>
                        </div>
                    </div>

                    {/* Right: Product Action */}
                    <div className="p-6 md:p-8 md:w-1/2 bg-white/5 flex flex-col items-center md:items-start relative overflow-hidden group">
                        {/* Hover Effect Background */}
                        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex items-start gap-4 mb-6 relative z-10 w-full">
                            <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden border-2 border-white/20 shrink-0 bg-white">
                                <img
                                    src={primaryProduct.image}
                                    alt={primaryProduct.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white uppercase text-lg leading-tight line-clamp-2">
                                    {primaryProduct.name}
                                </h4>
                                <p className="text-accent font-mono mt-1">
                                    {primaryProduct.price}
                                </p>
                            </div>
                        </div>

                        <a
                            href={primaryProduct.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full relative z-10 group/btn"
                        >
                            <div className="bg-white text-black font-black uppercase text-center py-4 px-6 flex items-center justify-center gap-2 hover:bg-accent transition-colors">
                                {dict?.transformation?.view_product || 'CONFIGURE GEAR'}
                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </div>
                        </a>

                        <div className="mt-3 flex justify-between w-full text-[10px] font-mono text-gray-500 uppercase">
                            <span>Secure Link</span>
                            <span>Redbubble Verified</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

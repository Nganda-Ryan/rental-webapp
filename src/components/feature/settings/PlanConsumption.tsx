'use client'
import { describeMyself } from '@/actions/userAction';
import { IMe } from '@/types/user';
import { useRouter } from '@bprogress/next/app';
import { BarChart, PieChart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ConsumptionGraph from './ConsumptionGraph';

const PlanConsumption = () => {
    const [me, setMe] = useState<IMe | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    const init = React.useCallback(async () => {
        try {
            setIsLoading(true);
        
            const meResult = await describeMyself();
        
            console.log('-->meResult', meResult);
        
        
            // Gestion des erreurs pour meResult
            if (meResult.error) {
                if (meResult.code === 'SESSION_EXPIRED') {
                router.push('/signin');
                return;
                }
                toast.error(meResult.error ?? "An unexpected error occurred", { position: 'bottom-right' });
            } else {
                setMe(meResult.data.body.userData);
            }
        } catch (err) {
            console.error("Erreur dans init:", err);
            toast.error("Une erreur inattendue est survenue", { position: 'bottom-right' });
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        init()
    }, [init])

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <PieChart size={20} />
                Plan Consumption
            </h2>
            <div className="space-y-6">
                {me && <ConsumptionGraph consumptions={me.Consumptions} />}
            </div>
        </div>
    )
}

export default PlanConsumption
'use client'
import { describeMyself } from '@/actions/userAction';
import { IMe } from '@/types/user';
import { useRouter } from '@bprogress/next/app';
import { BarChart, PieChart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ConsumptionGraph from './ConsumptionGraph';
import { useTranslations } from 'next-intl';

const PlanConsumption = () => {
    const [me, setMe] = useState<IMe | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('Common');

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
                toast.error(meResult.error ?? t('unexpectedError'), { position: 'bottom-right' });
            } else {
                setMe(meResult.data.body.userData);
            }
        } catch (err) {
            console.error("Erreur dans init:", err);
            toast.error(t('unexpectedError'), { position: 'bottom-right' });
        } finally {
            setIsLoading(false);
        }
    }, [router, t]);

    useEffect(() => {
        init()
    }, [init])

    return (
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <PieChart size={20} />
                {t('planConsumption')}
            </h2>
            <div className="space-y-6">
                {me && <ConsumptionGraph consumptions={me.Consumptions} />}
            </div>
        </div>
    )
}

export default PlanConsumption
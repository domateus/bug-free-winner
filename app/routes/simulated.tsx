export const meta: V2_MetaFunction = () => [{ title: "Analise concluída 🚀" }];

export const loader: LoaderFunction = async ({ request, context }: LoaderArgs) => {
    const url = new URL(request.url)
    
    const simulationId = url.searchParams.get('simulation')
    
    const simulationResponse = await getSimulationId(simulationId)
    
    return { simulationResponse }
}

export default function simulatedResponse() {
    const { simulationResponse } = useLoaderData<typeof loader>();
    
    
    return (
        
    )
}
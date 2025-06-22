import FormElementsSidebar from './FormElementsSidebar';
import useDesigner from './hooks/useDesigner';
import PropertiesFormSidebar from './PropertiesFormSidebar';

export default function DesignerSidebar() {
  const { selectedElement } = useDesigner();
  return (
    <aside className="border-muted bg-background flex h-full w-[400px] max-w-[400px] flex-grow flex-col gap-2 overflow-y-auto border-l-2 p-4">
      {!selectedElement && <FormElementsSidebar />}
      {selectedElement && <PropertiesFormSidebar />}
    </aside>
  );
}

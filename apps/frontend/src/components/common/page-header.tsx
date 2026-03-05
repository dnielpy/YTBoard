interface Props {
  title: string;
  pretitle: string;
  subtitle: string;
}

export const PageHeader = ({ title, subtitle, pretitle }: Props) => {
  return (
    <header className={"flex flex-col gap-2"}>
      {<p className="text-sm uppercase text-muted-foreground">{pretitle}</p>}
      <h1 className="text-3xl font-semibold leading-tight text-foreground">
        {title}
      </h1>
      {<p className="text-muted-foreground">{subtitle}</p>}
      {/* {<div className="mt-2 flex flex-wrap gap-2">{actions}</div>} */}
    </header>
  );
};

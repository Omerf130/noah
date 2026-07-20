import styles from './PackageCards.module.scss'

type Package = {
  title: string
  duration: string
  highlight: string
  features: string[]
}

type PackageCardsProps = {
  packages: Package[]
}

export default function PackageCards({ packages }: PackageCardsProps) {
  return (
    <div className={styles.grid}>
      {packages.map((pkg, index) => (
        <article key={pkg.title} className={[styles.card, index === 1 ? styles.featured : ''].join(' ')}>
          <h3>{pkg.title}</h3>
          <p className={styles.duration}>{pkg.duration}</p>
          <span className={styles.highlight}>{pkg.highlight}</span>
          <ul>
            {pkg.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

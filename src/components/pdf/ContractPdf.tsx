/* eslint-disable react/no-unescaped-entities */
'use client'

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import { AssetDataDetailed, IContractDetail } from '@/types/Property'
import { capitalize, capitalizeEachWord, formatDateToText, toUpperCase } from '@/lib/utils';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontSize: 11, 
    lineHeight: 1.4,
    fontFamily: 'Times-Roman'
  },
  title: { 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 20, 
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  section: { 
    marginBottom: 12 
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  textUnderLine: {
    textDecoration: 'underline',
    paddingBottom: 2,
  },
  articleTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    textDecoration: 'underline',
    paddingBottom: 2,
  },
  paragraph: {
    marginBottom: 4,
    textAlign: 'justify'
  },
  indentedText: {
    marginLeft: 20,
    marginBottom: 2
  },
  bulletPoint: {
    marginBottom: 2,
    marginLeft: 10
  },
  underlineSpace: {
    textDecoration: 'underline',
    paddingBottom: 2,
    minWidth: 150
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 20
  },
  signatureBlock: {
    textAlign: 'center',
    width: '45%'
  },
  centered: {
    textAlign: 'center'
  },
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  }
})

interface Props {
  contract: IContractDetail,
  asset: AssetDataDetailed,
  contractor: any,
}

export const ContractPdf = ({ contract, asset, contractor }: Props) => {
  const startDate = new Date(contract.startDate);
  const endDate = new Date(contract.endDate);
  const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Titre principal */}
        <Text style={[styles.title, styles.bold, styles.textUnderLine]}>CONTRAT DE BAIL A USAGE PROFESSIONNEL</Text>

        {/* Parties contractantes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.bold]}>ENTRE LES SOUSSIGNES :</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Nom :</Text> {capitalizeEachWord(contractor.firstname)} {toUpperCase(contractor.lastname)}
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>CNI : N° </Text>_________________ domiciliée à {contractor?.address?.City} lieudit {contractor?.address?.Street} ,
          </Text>
          <Text style={styles.paragraph}>
            Tél. {contractor.phone} désignée dans tout ce qui va suivre, <Text style={styles.bold}>« le bailleur »</Text>
          </Text>

          <Text style={styles.paragraph}>D'une part ;</Text>
          
          <Text style={[styles.paragraph, styles.bold]}>Et</Text>
          
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Nom :</Text> {toUpperCase(contract.tenant.lastName)} {capitalize(contract.tenant.firstName)}
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>CNI : N°</Text> _________________ domiciliée à _________________ lieudit _________________ ,
          </Text>
          <Text style={styles.paragraph}>
            Tél. {contract.tenant.phone} désignée dans tout ce qui va suivre, <Text style={styles.bold}>« le locataire »</Text>
          </Text>
          <Text style={styles.paragraph}>D'autre part ;</Text>
          
          <Text style={styles.paragraph}>
            Les deux ensembles ci-après dénommés « les parties »
          </Text>
        </View>

        {/* Formule d'engagement */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, styles.bold, styles.centered]}>
            IL A ETE CONVENU ET ARRETE CE QUI SUIT :
          </Text>
        </View>

        {/* Article 1 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 1 : OBJET DU BAIL</Text>
          <Text style={styles.paragraph}>
            Le présent bail, soumis aux dispositions de l'Acte Uniforme OHADA 
            sur le Droit Commercial Général et aux textes applicables du droit 
            Camerounais, a pour objet de définir les conditions dans lesquelles le locataire 
            est autorisé à exploiter l'immeuble du bailleur situé à {asset.Address.City} au lieu-
            dit {asset.Address.Street} ;
          </Text>
        </View>

        {/* Article 2 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 2 : DESIGNATION DES LIEUX LOUÉS</Text>
          <Text style={styles.paragraph}>
            Le bailleur donne à bail au locataire qui accepte, un {asset.TypeCode} constitué de :
          </Text>
          <Text style={styles.bulletPoint}>- Un (01) salon ;</Text>
          <Text style={styles.bulletPoint}>- Une (01) cuisine ;</Text>
          <Text style={styles.bulletPoint}>- Deux (02) chambres à coucher ;</Text>
          <Text style={styles.bulletPoint}>- Une (01) douche ;</Text>
          <Text style={styles.paragraph}>
            Il n'est pas fait plus ample description, le locataire déclarant bien 
            connaître les lieux pour les avoir visités.
          </Text>
        </View>

        {/* Article 4 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 4 : OBLIGATIONS DES PARTIES</Text>
          <Text style={styles.paragraph}>
            Les obligations des parties sont celles prévues aux articles 105 à 115 de 
            l'Acte Uniforme OHADA relatif au Droit Commercial Général ;
          </Text>
          
          <Text style={[styles.paragraph, styles.bold]}>4.1 : Obligations du locataire</Text>
          <Text style={styles.paragraph}>Par le présent contrat, le locataire s'engage à :</Text>
          <Text style={styles.bulletPoint}>- Payer le prix convenu à bonne date ;</Text>
          <Text style={styles.bulletPoint}>
            - Tenir les lieux mis à disposition en bon état de réparation locative et 
            d'entretien de toute nature, ainsi qu'en état de propriété ;
          </Text>
          <Text style={styles.bulletPoint}>
            - S'abstenir de poser tout acte qui pourrait troubler la tranquillité du site 
            nuire à sa sécurité et/ou à sa bonne tenue ;
          </Text>
          <Text style={styles.bulletPoint}>
            - Satisfaire toutes les charges de ville, de police et de voirie auxquelles 
            les locataires sont habituellement tenus, dans la mesure où elle pourra 
            y être assujettie conformément à la législation en vigueur ;
          </Text>
          <Text style={styles.bulletPoint}>
            - Procéder à ses frais l'enregistrement du présent contrat et transmettre 
            au bailleur un exemplaire
          </Text>
          
          <Text style={[styles.paragraph, styles.bold]}>4.2 : Obligation du bailleur</Text>
          <Text style={styles.paragraph}>Par le présent contrat, le bailleur s'engage à :</Text>
          <Text style={styles.bulletPoint}>
            - Assurer au locataire un accès et une jouissance paisible de la partie de 
            l'immeuble loué pendant toute la durée du bail ;
          </Text>
          <Text style={styles.bulletPoint}>
            - Informer tout éventuel acquéreur de son immeuble de l'existence du 
            présent bail ;
          </Text>
        </View>

        {/* Article 5 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 5 : CLAUSE DE PREEMPTION</Text>
          <Text style={styles.paragraph}>
            Les parties conviennent que le locataire bénéficie d'un droit de 
            préemption en cas de vente du bien loué par le bailleur ;
          </Text>
        </View>

        {/* Article 6 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 6 : CESSION/ SOUS LOCATION</Text>
          <Text style={[styles.paragraph, styles.bold]}>6.1 Cession du bail</Text>
          <Text style={styles.paragraph}>
            a/ Le bailleur autorise la cession par le locataire de tout ou partie du bail 
            et la totalité ;
          </Text>
          <Text style={styles.paragraph}>
            b/ Le locataire portera à la connaissance du bailleur l'acte de cession 
            mentionnant l'identité complète du cessionnaire, son adresse et son numéro 
            d'immatriculation sur le registre du Commerce et du Crédit Mobilier 
            (RCCM). Il informera le bailleur de ladite cession par tout moyen permettant 
            d'en établir la réception effective par celui-ci ;
          </Text>
          <Text style={styles.paragraph}>
            c/ Le bailleur disposera d'un délai d'un (1) mois à compter de la 
            signification ou de la notification de l'acte de cession pour s'opposer, le cas 
            échéant, à la cession opérée par le locataire. Toutefois, il ne pourra s'y opposer 
            qu'en cas de non-paiement des loyers restants dus.
          </Text>
          
          <Text style={[styles.paragraph, styles.bold]}>6.2 Sous Location</Text>
          <Text style={styles.paragraph}>
            a/ La Sous location sera soumise à l'autorisation préalable du bailleur 
            par le locataire ;
          </Text>
          <Text style={styles.paragraph}>
            La Sous location se fera dans les mêmes conditions que celles visées à 
            l'article 61 (b).
          </Text>
        </View>

        {/* Article 7 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 7 : MODIFICATION</Text>
          <Text style={styles.paragraph}>
            Les installations pourront faire l'objet de toutes les modifications 
            techniques que le locataire jugera utile, dès lors qu'elles seront compatibles 
            avec la configuration générale des lieux, l'autorisation écrite du bailleur ne 
            sera nécessaire que si cette configuration doit être changée ;
          </Text>
        </View>

        {/* Article 8 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 8 : RESTITUTION DES LIEUX LOUÉS</Text>
          <Text style={styles.paragraph}>
            A la cession d'occupation des lieux, le locataire s'engage à les 
            restituer en bon état d'entretien locatif compte tenu d'un usage et d'un 
            entretien normal, et des conditions de jouissance, stipulées au présent contrat ;
          </Text>
        </View>

        {/* Article 9 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 9 : DUREE-ENTREE EN JOUISSANCE - RENOUVELLEMENT</Text>
          <Text style={styles.paragraph}>
            Conformément à l'article 104 de l'Acte Uniforme OHADA relatif du 
            Droit Commercial Général prévoyant la liberté des parties dans la 
            détermination de la durée du bail commercial, le présent bail est consenti et 
            accepté pour une durée de {monthDiff} mois non renouvelable ;
          </Text>
          <Text style={styles.paragraph}>
            Le locataire pourra faire cesser le bail à tout moment à charge pour 
            lui/de signifier cette intention au bailleur par acte extrajudiciaire au moins 
            trois (03) mois avant la fin de la période en cours ;
          </Text>
          <Text style={styles.paragraph}>
            Avant le terme du bail, le locataire pourra demander le renouvellement 
            du bail par simple lettre accusé de réception au plus tard trois (03) mois avant 
            la date d'expiration ;
          </Text>
          <Text style={styles.paragraph}>
            Le bailleur devra faire connaître au locataire sa réponse par simple 
            lettre, dans le mois suivant la correspondance qui lui sera adressée. Son silence 
            au bout de ce délai sera considéré comme valant accord de renouvellement ;
          </Text>
          <Text style={styles.paragraph}>
            Si le locataire est amené à rester sur les lieux loués au-delà du terme du bail 
            pour quelques raisons que ce soit, les parties conviennent que le locataire 
            paiera au bailleur par mois d'occupation d'une indemnité égale au dernier 
            loyer mensuel en vigueur ;
          </Text>
          <Text style={styles.paragraph}>
            Le présent bail est fait pour une durée de {monthDiff} mois allant du {formatDateToText(contract.startDate)} jusqu'au {formatDateToText(contract.endDate)}.
          </Text>
          <Text style={styles.paragraph}>
            Le présent bail prend effet dès sa signature.
          </Text>
        </View>

        {/* Article 10 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 10 : LOYER</Text>
          <Text style={styles.paragraph}>
            Le présent bail est consenti et accepté moyennant un loyer mensuel de {contract.monthlyRent.toLocaleString()} {contract.currency} ;
          </Text>
          <Text style={styles.paragraph}>
            Le loyer est payé semestriellement et d'avance contre délivrance d'un 
            reçu
          </Text>
        </View>

        {/* Article 11 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 11 : ABONNEMENT AU FOURNISSEUR D'ELLECTRICITE ENEO ET CDE</Text>
          <Text style={styles.paragraph}>
            Le locataire pourrait prendre son propre abonnement auprès du 
            fournisseur ENEO, CDE dans un délai d'un (01) mois à compter de la 
            signature du présent contrat ;
          </Text>
        </View>

        {/* Article 12 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 12 : DEFAUT DE PAIEMENT-EXECUTION</Text>
          <Text style={styles.paragraph}>
            A défaut de paiement d&apos;un seul terme de loyer à son échéance ou en cas 
            d&apos;inexécution par le locataire de l&apos;une quelconque de ses obligations au titre 
            du présent contrat, le bailleur pourra demander à la juridiction compétente de 
            résilier la bail après avoir préalablement fait délivrer au locataire par acte 
            extrajudiciaire , une mise en demeure d&apos;avoir à respecter ses obligation ;
          </Text>
          <Text style={styles.paragraph}>
            Si cette mise en demeure n&apos;est pas suivie d&apos;effet dans le délai d&apos;un (1) 
            mois, la résiliation du bail pourra être poursuivie dans les conditions prévues 
            à l&apos;article 133 de l&apos;Acte Uniforme OHADA relatif au Droit Commercial 
            Général ;
          </Text>
          <Text style={styles.paragraph}>
            En cas d&apos;inexécution par le bailleur de l&apos;une quelconque de ses 
            obligations au titre du présent contrat, le locataire pourra s&apos;il le souhaite 
            résilier le présent contrat. La résiliation à l&apos;initiative de locataire suivra la 
            même d&apos;arrangement amiable que ci-dessus ;
          </Text>
        </View>

        {/* Article 13 */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article 13 : ATTRIBUTION DE COMPETENCE</Text>
          <Text style={styles.paragraph}>
            Tous litiges relatifs à l&apos;exécution, l&apos;interprétation, ou à la résiliation du 
            présent bail, feront préalablement l&apos;objet d&apos;une tentative d&apos;arrangement 
            amiable entre les parties ;
          </Text>
          <Text style={styles.paragraph}>
            A défaut d'accord, les litiges relèveront des Tribunaux territorialement 
            compétents
          </Text>
        </View>

        {/* Notes complémentaires */}
        {contract.notes && (
          <View style={styles.section}>
            <Text style={styles.articleTitle}>Notes complémentaires</Text>
            <Text style={styles.paragraph}>{contract.notes}</Text>
          </View>
        )}

        {/* Éléments de facturation */}
        {contract.billingElements && contract.billingElements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.articleTitle}>Éléments de facturation</Text>
            {contract.billingElements.map((element, index) => (
              <Text key={index} style={styles.bulletPoint}>
                - {element.label} ({element.code})
              </Text>
            ))}
          </View>
        )}

        {/* Signature */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Fait en cinq (02) exemplaires dont un exemplaire pour chaque 
            partie.
          </Text>
          <Text style={styles.paragraph}>{contractor?.address?.City}, le {formatDateToText(contract.startDate)}</Text>
        </View>

        {/* Bloc de signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text>Lu et approuvé</Text>
            <Text>Le Bailleur</Text>
            <Text style={styles.bold}>{capitalizeEachWord(contractor.firstname)} {toUpperCase(contractor.lastname)}</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text>Lu et approuvé</Text>
            <Text>Le Locataire</Text>
            <Text style={styles.bold}>{capitalize(contract.tenant.firstName)} {toUpperCase(contract.tenant.lastName)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}